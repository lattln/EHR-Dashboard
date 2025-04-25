import { Accounts } from 'meteor/accounts-base';
import { UserRoles } from '../../api/User/userRoles.js';


//WIP account creation hook. logic for adding roles, checking if an account already exists in the fhir server and doesnt already exist in the accounts db.
Accounts.onCreateUser((options, user) => {
  // Add custom fields to the user object
  user.profile = options.profile !== undefined ? options.profile : {}
  //global fields all user objects should have
  user.config = [];

  //add any additional properties to the user object before adding it to the users collection.
  const {firstName, lastName, dob, phoneNumber, fhirID} = options;

  switch (options.role) {
    case UserRoles.PATIENT:
      user.profile.firstName = firstName;
      user.profile.lastName = lastName;
      user.profile.dob = dob;
      user.profile.phoneNumber = phoneNumber;
      user.fhirID = fhirID;
      user.clinicians = [];
      user.config = [
        {
          name: "Preset 1",
          widget: [{
            id: "bmi",
            label: "BMI",
            type: "BMI",
            height: 1,
            width: 1
          },
          {
            id: "steps",
            label: "Steps",
            type: "Steps",
            height: 1,
            width: 1
          },
          {
            id: "sleepHeatMap",
            label: "Last Week of Sleep",
            type: "SleepHeatMap",
            height: 1,
            width: 2
          },
          {
            id: "sleepBreakdown",
            label: "Sleep Breakdown",
            type: "SleepBreakdown",
            height: 1,
            width: 1
          },
          {
            id: "sleepDuration",
            label: "Sleep Duration",
            type: "SleepDuration",
            height: 1,
            width: 1
          },
          {
            id: "sleepEfficiency",
            label: "Sleep Efficiency",
            type: "SleepEfficiency",
            height: 1,
            width: 1
          },
          {
            id: "weight",
            label: "Weight",
            type: "Weight",
            height: 1,
            width: 2
          }]
        }
      ]  
      break;
    case UserRoles.CLINICIAN:
      user.profile.firstName = firstName;
      user.profile.lastName = lastName;
      user.patients = [];

      break;
    case UserRoles.ADMIN:
      break
    default:
      throw new Meteor.Error("Invalid Role Assignment", "The role provided is invalid.")
  }

  return user;
});