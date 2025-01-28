import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { roles } from '../api/User/userRoles.js';


//WIP account creation hook. logic for adding roles, checking if an account already exists in the fhir server and doesnt already exist in the accounts db.
Accounts.onCreateUser(async (options, user) => {
  // Add custom fields to the user object
  if (options.profile) {
    user.profile = options.profile;
  }

  switch (options.role) {
    case "patient":
      const {firstName, lastName, dob, phoneNumber} = options;
      const fhirID = await Meteor.callAsync("patient.findByInfo", {
        patientGivenName: firstName,
        patientFamilyName: lastName,
        patientDOB: dob,
        patientPhoneNumber: phoneNumber,
      });

      if (fhirID !== -1) {
        user.fhirID = fhirID;
      } 
      else {
        throw new Meteor.Error("Patient Not Found", "A patient with the provided information does not exist in the fhir server.");
      }

      user.profile.firstName = firstName;
      user.profile.lastName = lastName;
      user.profile.dob = dob;
      user.profile.phoneNumber = phoneNumber;

      break;
    case "clinician":
      break;
    case "admin":
      break
    default:
      throw new Meteor.Error("Invalid Role Assignment", "The role provided is invalid.")
  }

  return user;
});