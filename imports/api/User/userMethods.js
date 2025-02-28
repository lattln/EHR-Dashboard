import { Meteor } from 'meteor/meteor'; 
import { Roles } from 'meteor/alanning:roles';


Meteor.methods({
    async 'user.signup'(userInformation) {
        if (!this.isSimulation) {
            let signupUser = await import("./Server/UserUtils.js");
            try {
                await signupUser(userInformation)
            } catch (error) {
                console.log(error.reason)
                throw error;
            }
        }
        
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
    },

});