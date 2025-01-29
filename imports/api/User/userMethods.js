import { Meteor } from 'meteor/meteor'; 
import { Roles } from 'meteor/alanning:roles';
import { roles } from './userRoles';

async function patientHandler(options = {firstName, lastName, email, password, phoneNumber, dob, role}) {
    if (!firstName || !lastName || !phoneNumber || !dob) {
        throw new Meteor.Error("Not Enough Information", "the provided user information is not enough to create a patient account");
    }

    let userID;
    try {
        userID = await Accounts.createUserAsync({email, password, firstName, lastName, phoneNumber, dob, role});
    }
    catch (error){
        if (error.error === 403 && error.reason === 'Email already exists.') {
            throw new Meteor.Error('Email Already Exists', 'The email address is already in use. Please use a different email.');
        }
        else throw error;

    }

    return userID 
} 

function clinicianHandler(options = {firstName, lastName, email, password, phoneNumber, role}) {
    //TODO
    if (!firstName || !lastName || !phoneNumber || !password) {
        throw new Meteor.Error("Not Enough Information", "the provided user information is not enough to create a clinician account");
    }
}

function adminHandler(options) {
    //TODO
}

Meteor.methods({
    async 'user.signup'(userInformation) {

        const {email, password, role} = userInformation;
        
        if(!email || !password || !role){
            throw new Meteor.Error("Not Enough Information", "the provided user information is not enough for account creation.")
        }
        //let userId = Accounts.createUser({ email, password, firstName, lastName, dob, phoneNumber});
        let userID;

        switch (role) {
            case roles.PATIENT:
                userID = await patientHandler(userInformation)
                break;
            case roles.CLINICIAN:
                userID = await clinicianHandler(userInformation);
                throw new Meteor.Error("Unimplemented", "Current feature is not implemented yet.");
            case roles.ADMIN:
                throw new Meteor.Error("Unimplemented", "Current feature is not implemented yet.");
            default:
                throw new Meteor.Error("Invalid Role Assignment", "The role provided is invalid.")
        }

        await Roles.addUsersToRolesAsync(userID, [role]);
        console.log(`${userID} given role: ${role}.`);
        console.log(`User created with id: ${userID} and role ${role}.`);   // this should be logged later on
        return userID;
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