import { Accounts } from 'meteor/accounts-base';
import { roles } from '../api/User/userRoles.js';


//WIP account creation hook. logic for adding roles, checking if an account already exists in the fhir server and doesnt already exist in the accounts db.
Accounts.onCreateUser(async (options, user) => {
  // Add custom fields to the user object
  if (options.profile) {
    user.profile = options.profile;
  }

  switch (options.role) {
    case roles.PATIENT:
      const {firstName, lastName, dob, phoneNumber, fhirID} = options;

      user.profile.firstName = firstName;
      user.profile.lastName = lastName;
      user.profile.dob = dob;
      user.profile.phoneNumber = phoneNumber;
      user.fhirID = fhirID;

      break;
    case roles.CLINICIAN:
      break;
    case roles.ADMIN:
      break
    default:
      throw new Meteor.Error("Invalid Role Assignment", "The role provided is invalid.")
  }

  return user;
});