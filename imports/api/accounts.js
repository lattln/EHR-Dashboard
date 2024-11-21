import { Accounts } from 'meteor/accounts-base';

Accounts.config({
    forbidClientAccountCreation: false // this allows users to sign up
});