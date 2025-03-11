import fitBitUtils from "./utils";
import { decJWT } from "./auth";

/*Scopes we ask for:
    1. respiratory_rate
    2. heartrate
    3. activity
    4. temperature
    5. cardio_fitness
    6. sleep
    7. oxygen_saturation
*/

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
    console.log(today);

    return {
        goal: res.goals.steps,
        steps: res.summary.steps
    }
}

async function getHeartRate(){
    return await makeRequest('/1/user/-/activities/heart/date/today/1d.json');
}

async function getSleepLog(){
    return await makeRequest(`/1.2/user/-/sleep/date/today.json`);
}

export {
    getActivityLog,
    getCalories,
    getCurrentSteps,
    getHeartRate,
    getSleepLog,
};