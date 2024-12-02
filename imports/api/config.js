import { Accounts } from 'meteor/accounts-base';

Accounts.config({
    loginExpirationInDays: 7 // <- expiration time for remember me
})