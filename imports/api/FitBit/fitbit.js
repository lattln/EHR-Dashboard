import fitBitUtils from "./utils";
import { decJWT } from "./auth";

/*
Scopes we ask for:
    1. respiratory_rate
    2. heartrate
    3. activity
    4. temperature
    5. cardio_fitness
    6. sleep
    7. oxygen_saturation
*/

const chartColors = [
    'rgb(255, 99, 132)',
    'rgb(53, 162, 235)',
    '#c51d34',
    '#6c6960',
    '#1c1c1c',
    '#734222',
    '#8673a1'
]

async function makeRequest(url){
    let jwt = await decJWT(localStorage.getItem('fitbit-token'));
    let res = await fetch(`https://api.fitbit.com${url}`, {
        headers: new Headers({
            'authorization': `Bearer ${jwt.access_token}`,
            'accept': 'application/json' 
        })
    })

    return await res.json();
}

async function getActivityLog(){
    let queryParams = new URLSearchParams({
        afterDate: getLastWeekString(),
        sort: 'asc',
        limit: 10,
        offset: 0
    })
    return await makeRequest('/1/user/-/activities/list.json?' + queryParams.toString());
}

async function getCalories(){
    return await makeRequest('/1/user/-/activities/calories/date/today/7d.json')
}

async function getCurrentSteps(){
    let today = fitBitUtils.today();
    let res = await makeRequest(`/1/user/-/activities/date/${today}.json`);

    return {
        goal: res.goals.steps,
        steps: res.summary.steps,
        distance: res.summary.distances[0].distance
    }
}

async function getHeartRate(){
    let yesterday = fitBitUtils.yesterday();
    let res = await makeRequest(`/1/user/-/activities/heart/date/${yesterday}/1d.json`);

    let timeSpentInZones = [{
        label: "Minutes",
        data: res['activities-heart'][0].value.heartRateZones.map((z) => {
            return z.minutes;
        }),
        backgroundColor: chartColors
    }]

    return {
        timeData: timeSpentInZones
    }
}

async function getSleepBreakdown(){
    let today = fitBitUtils.today();
    let sleepLog = await makeRequest(`/1.2/user/-/sleep/date/${today}.json`);
    if(sleepLog.sleep.length < 1){
        return {
            success: false
        }
    }
    
    let summaryData = [{
        label: "Minutes",
        data: [sleepLog.summary.stages.deep, sleepLog.summary.stages.light, sleepLog.summary.stages.rem, sleepLog.summary.stages.wake],
        backgroundColor: chartColors
    }]

    return {
        success: true,
        data: summaryData
    }
}

async function getSleepDuration(){
    let today = fitBitUtils.today();
    let sleepGoal = await makeRequest('/1.2/user/-/sleep/goal.json');
    let sleepLog = await makeRequest(`/1.2/user/-/sleep/date/${today}.json`);
    
    let stack = sleepGoal.goal.minDuration - sleepLog.summary.totalMinutesAsleep;

    if(stack < 0){
        stack = 0;
    }

    if(!(sleepLog.sleep.length > 0)){
        return {
            success: false
        }
    }

    let durationData = [
        {
            label: "Duration",
            data: [sleepLog.summary.totalMinutesAsleep],
            backgroundColor: [chartColors[0]]
        },
        {
            label: "Goal",
            data: [stack],
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        },
    ]

    return {
        success: true,
        duration: sleepLog.summary.totalMinutesAsleep,
        durationData: durationData,
        goal: sleepGoal.goal.minDuration
    };
}

async function getSleepEfficiency(){
    let today = fitBitUtils.today();
    let sleepLog = await makeRequest(`/1.2/user/-/sleep/date/${today}.json`);

    if(sleepLog.sleep.length > 0){
        return {
            efficiency: sleepLog.sleep[0].efficiency
        }
    }

    return {
        efficiency: -1
    }
}

async function getSleepHeatMap(){
    let today = fitBitUtils.today();
    let lastWeek = fitBitUtils.lastWeek();
    let days = ["We", "Th", "Fr", "Sa", "Su", "Mo", "Tu", "We"];
    let data = [];

    /*let sleepLog = await makeRequest(`/1.2/user/-/sleep/date/${lastWeek}/${today}.json`);
    sleepLog.sleep = sleepLog.sleep.reverse();

    sleepLog.sleep.map((log) => {
        let num = Math.random()
        days.push(new Date(log.dateOfSleep).toUTCString().substring(0, 2));
        data.push(log.efficiency);
    })*/

    for(i = 0; i < 7; i++){
        let num = Math.floor(Math.random() * (97-79) + 79);
        data.push(num);
    }

    return {
        data: data,
        days: days
    }
}

export {
    getActivityLog,
    getCalories,
    getCurrentSteps,
    getHeartRate,
    getSleepBreakdown,
    getSleepDuration,
    getSleepEfficiency,
    getSleepHeatMap
};