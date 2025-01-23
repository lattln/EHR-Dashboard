import { Accounts } from 'meteor/accounts-base';

//WIP account creation hook. logic for adding roles, checking if an account already exists in the fhir server and doesnt already exist in the accounts db.
Accounts.onCreateUser((options, user) => {
  // Your custom logic here
  return user;
});