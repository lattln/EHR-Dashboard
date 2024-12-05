import { Meteor } from 'meteor/meteor'; 
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
    async 'user.signup'(email, password, role) {
        const userId = await Accounts.createUser({ email, password });

        if (Meteor.isServer) {
            Roles.addUsersToRolesAsync(userId, [role]);
            console.log(`${userId} given role: ${role}.`);
        }

        console.log(`User created with id: ${userId} and role ${role}.`);   // this should be logged later on
        return userId;
    },
    /* example method for authorizing certain users to perform tasks
    *  
    *  this will be augmented later on to only permit admins to create clinician accounts/assign clinician & admin role
    */
    'user.assignRole'(userId, role) {
        if (Meteor.userId() && Roles.userIsInRole(Meteor.userId, 'admin')) {
            Roles.addUsersToRolesAsync(userId, [role]);
        } else {
            throw new Meteor.Error('not-authorized');
        }
    }
});