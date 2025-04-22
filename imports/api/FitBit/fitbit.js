import colors from "../../ui/Widgets/colors";
import { decJWT } from "./auth";
import fitBitUtils from "./utils";
import { Meteor } from "meteor/meteor";

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

async function makeRequest(url, userID){
    let token = await Meteor.users.findOneAsync({ _id: userID }, { fields: { fitbitAccountAuth: 1 }});
    if(!userID || !token.fitbitAccountAuth){
        return {
            success: false,
            err: "Not logged in to fitbit"
        }

    }

    let jwe = await decJWT(token.fitbitAccountAuth);
    let res = await fetch(`https://api.fitbit.com${url}`, {
        headers: new Headers({
            Authorization: `Bearer ${jwe.access_token}`,
            Accept: 'application/json',
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

async function getCurrentSteps(userID){
    let today = fitBitUtils.today();
    let res = await makeRequest(`/1/user/-/activities/date/${today}.json`, userID);

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
        backgroundColor: colors 
    }]

    return {
        timeData: timeSpentInZones
    }
}

async function getSleepBreakdown(userId){
    let today = fitBitUtils.today();
    let sleepLog = await makeRequest(`/1.2/user/-/sleep/date/${today}.json`, userId);
    if(sleepLog.sleep.length < 1){
        return {
            success: false
        }
    }
    
    let summaryData = [{
        label: "Minutes",
        data: [sleepLog.summary.stages.deep, sleepLog.summary.stages.light, sleepLog.summary.stages.rem, sleepLog.summary.stages.wake],
        backgroundColor: colors 
    }]

    return {
        success: true,
        data: summaryData
    }
}

async function getSleepDuration(userId){
    let today = fitBitUtils.today();
    let sleepGoal = await makeRequest('/1.2/user/-/sleep/goal.json', userId);
    let sleepLog = await makeRequest(`/1.2/user/-/sleep/date/${today}.json`, userId);
    
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
            backgroundColor: [colors[0]]
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

async function getSleepEfficiency(userId){
    let today = fitBitUtils.today();
    let sleepLog = await makeRequest(`/1.2/user/-/sleep/date/${today}.json`, userId);

    if(sleepLog.sleep.length > 0){
        return {
            efficiency: sleepLog.sleep[0].efficiency
        }
    }

    return {
        efficiency: -1
    }
}

async function getSleepHeatMap(userId){
    let today = fitBitUtils.today();
    let lastWeek = fitBitUtils.lastWeek();
    let days = [];
    let data = [];

    let sleepLog = await makeRequest(`/1.2/user/-/sleep/date/${lastWeek}/${today}.json`, userId);
    sleepLog.sleep = sleepLog.sleep.reverse();

    sleepLog.sleep.map((log) => {
        days.push(new Date(log.dateOfSleep).toUTCString().substring(0, 2));
        data.push(log.efficiency);
    })

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