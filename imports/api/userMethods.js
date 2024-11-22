import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
    async 'users.signup'(email, password, role) {
        const userId = await Accounts.createUser({ email, password });

        if (Meteor.isServer) {
            Roles.addUsersToRolesAsync(userId, [role]);
            console.log(`${userId} given role: ${role}`)
        }

        console.log(`user created with id: ${userId} and role: ${role}`)

        return userId;
    },
    'users.assignRole'(userId, role) {
        if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'admin')) {
            Roles.addUsersToRolesAsync(userId, [role]);
        } else {
            throw new Meteor.Error('not-authorized');
        }
    }
});