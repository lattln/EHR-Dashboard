import { Meteor } from 'meteor/meteor'; 
import { Roles } from 'meteor/alanning:roles';
import { UserRoles } from './userRoles';

async function patientHandler(options) {
    const {
        firstName, 
        lastName, 
        email, 
        password, 
        phoneNumber, 
        dob, 
        role
    } = options;
    
    if (!firstName || !lastName || !phoneNumber || !dob) {

        throw new Meteor.Error("Not Enough Information", 
            "the provided user information is not enough to create a patient account");
    }

    let fhirID = 0;
    try {
        fhirID = await Meteor.callAsync(
            "patient.findByInfo", 
            {
                patientGivenName: firstName,
                patientFamilyName: lastName,
                patientDOB: dob,
                patientPhoneNumber: phoneNumber,
            });
    } 
    catch (error) {
        if (error instanceof Meteor.Error) {
            throw error;
        } else {
            console.error(error.message);
            throw new Meteor.Error("Account-Creation-Internal-Error");
        }
    }
    

    //possible logic error here. fhirID could either be a list of ids that all were matching the patient information
    //a single id that corresponds with only a single patient or -1 for no patient found.
    if (fhirID === -1) {
        throw new Meteor.Error("Patient Not Found", 
            "A patient with the provided information does not exist in the fhir server.");
    } 
    
    let userID;
    try {
        userID = await Accounts.createUserAsync(
            {
                email, 
                password, 
                firstName, 
                lastName, 
                phoneNumber, 
                dob,
                fhirID, 
                role
            });
    }
    catch (error){
        console.error(error.message);
        if (error.error === 403 && error.reason === 'Email already exists.') {
            throw new Meteor.Error('Email Already Exists', 
                'The email address is already in use. Please use a different email.');
        }
        else if (error instanceof Meteor.Error) {
            throw error;
        }
        else {
            throw new Meteor.Error("Account-Creation-Internal-Error", error.message);
        };
    }

    return userID 
} 

async function clinicianHandler(options) {
    //TODO
    const {
        firstName, 
        lastName, 
        email, 
        password, 
        role
    } = options;

    if (!firstName || !lastName ||  !password) {
        throw new Meteor.Error("Not Enough Information", 
            "the provided user information is not enough to create a clinician account");
    }

    let userID;
    try {
        userID = await Accounts.createUserAsync(options);
    }
    catch (error) {
        if (error.error === 403 && error.reason === 'Email already exists.') {
            throw new Meteor.Error('Email Already Exists', 
                'The email address is already in use. Please use a different email.');
        }
        else if (error instanceof Meteor.Error) {
            throw error;
        }
        else {
            console.error(error.message);
            throw new Meteor.Error("Account-Creation-Internal-Error", "Something unexpected happened");
        }
    }
    return userID;
}

function adminHandler(options) {
    //TODO
}

Meteor.methods({
    async 'user.signup'(userInformation) {

        const {email, password, role} = userInformation;
        
        if(!email || !password || !role){
            throw new Meteor.Error("Not Enough Information", 
                "the provided user information is not enough for account creation.")
        }
        //let userId = Accounts.createUser({ email, password, firstName, lastName, dob, phoneNumber});
        let userID;

        try {
            switch (role) {
                case UserRoles.PATIENT:
                    userID = await patientHandler(userInformation)
                    break;
                case UserRoles.CLINICIAN:
                    userID = await clinicianHandler(userInformation);
                    break;
                case UserRoles.ADMIN:
                    throw new Meteor.Error("Unauthorized", 
                        "Cannot create admin accounts from this method.");
                default:
                    throw new Meteor.Error("Invalid Role Assignment", 
                        "The role provided is invalid.")
            }
    
            await Roles.addUsersToRolesAsync(userID, [role]);
            console.log(`${userID} given role: ${role}.`);
            console.log(`User created with id: ${userID} and role ${role}.`);   // this should be logged later on
            return userID;
        }
        catch (error) {
            if (error instanceof Meteor.Error) {
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