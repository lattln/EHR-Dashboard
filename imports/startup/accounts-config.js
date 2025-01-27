import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';
import { roles } from '../api/User/userRoles.js';

//WIP account creation hook. logic for adding roles, checking if an account already exists in the fhir server and doesnt already exist in the accounts db.
Accounts.onCreateUser(async (options, user) => {

  let {role, firstName, lastName, dob, phoneNumber} = options;
  const validRoles = roles.includes(role);

  if (!role || !validRoles){
    throw new Meteor.Error("Invalid Role");
  }

  if(!firstName || !lastName, !dob, !phoneNumber) {
    throw new Meteor.Error("missing required user information.");
  }
  
  let fhirSearchPromise = Meteor.callAsync("patient.findByInfo", {
    patientGivenName: firstName, 
    patientFamilyName: lastName, 
    patientDOB: dob,
    patientPhoneNumber: phoneNumber 
  });

  //let databaseSearchPromise = 

  
  

  return user;
});