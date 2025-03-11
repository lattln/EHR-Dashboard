import { format } from "date-fns";

const DATE_FORMAT = "yyyy-MM-dd";
/*
    Goes through a url and matches portions between brackets to values in an object.
    example: replaceParams(https://api.fitbit.com/1/user/[user-id]/activities/list.json, { 'user-id': 'UCH242' });

    returns: https://api.fitbit.com/1/user/UCH242/activities/list.json
*/
function replaceParams(url, params){
    if(url.indexOf('[') < 0){
        return url;
    }

    let newUrl = '';
    let openBracket = url.indexOf('[');
    let closedBracket = url.indexOf(']');
    let paramName = url.substring(openBracket + 1, closedBracket);
    newUrl = url.substring(0, openBracket) + params[paramName] + url.substring(closedBracket + 1); 

    return replaceParams(newUrl, params);
}

function getTodayString(){
    return format(new Date(), DATE_FORMAT);
}

//Returns a string that represents yesterday
function getYesterdayString(){
    let today = new Date();
    let yesterday = today.setDate(today.getDate() - 1);
    let yesterdayString = format(yesterday, DATE_FORMAT); 
    return yesterdayString;
}

//Returns a string that represents the date 7 days ago
function getLastWeekString(){
    const today = new Date();
    let lastWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    return format(lastWeek, DATE_FORMAT);
}

const fitBitUtils = {
    today: getTodayString,
    lastWeek: getLastWeekString,
    replaceURLParams: replaceParams,
    yesterday: getYesterdayString,
}

export default fitBitUtils;