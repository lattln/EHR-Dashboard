import { Meteor } from 'meteor/meteor';

async function main(){
    const result = await Meteor.callAsync("patient.getRecentLabs", 1, 100);
    let jsonString = JSON.stringify(result, null, 4);
    console.log(jsonString);
}
main();
