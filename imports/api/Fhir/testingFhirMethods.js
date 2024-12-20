const {Meteor} = require(`meteor/meteor`);

const result = await Meteor.callAsync("patient.getRecentLabs", "Patient/1");
let jsonString = JSON.stringify(result, null, 4);
console.log(jsonString);