import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    createAccount({ email, password }) {
        if (!email || !password || !role) {
            throw new Meteor.Error('400', 'Email, password, and role are required.');
        }

        const userId = Accounts.createUser({ email, password });

        Meteor.users.update(userId, {
            $set: {
                'profile.role': role
            }
        });

        console.log(`User added with id: ${userId}`);

        return userId;
    }
})