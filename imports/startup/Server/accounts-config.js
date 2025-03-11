import { Accounts } from 'meteor/accounts-base';
import { UserRoles } from '../../api/User/userRoles.js';


//WIP account creation hook. logic for adding roles, checking if an account already exists in the fhir server and doesnt already exist in the accounts db.
Accounts.onCreateUser((options, user) => {
  // Add custom fields to the user object
  if (options.profile) {
    user.profile = options.profile;
  }
  //global fields all user objects should have
  user.config = {};

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