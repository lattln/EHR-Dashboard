import { Meteor } from 'meteor/meteor'; 
import { Roles } from 'meteor/alanning:roles';
import { UserRoles } from "../userRoles.js"
import {findPatientByInfo} from '../../Fhir/Server/FhirUtils.js';
import { logger } from "../../Logging/Server/logger-config.js";

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
        
        let error =  new Meteor.Error("Not Enough Information", 
            "the provided user information is not enough to create a patient account");
        logger.error(error, error.reason);
        throw error;
    }
    
    let fhirID = 0;
    try {
        fhirID = await findPatientByInfo( 
            {
                patientGivenName: firstName,
                patientFamilyName: lastName,
                patientDOB: dob,
                patientPhoneNumber: phoneNumber,
            });
    } 
    catch (error) {

        logger.error(error, error.message);
        throw new Meteor.Error("Account-Creation-Internal-Error");
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
        logger.error(error);
        if (error.error === 403 && error.reason === 'Email already exists.') {
            throw new Meteor.Error('Email Already Exists', 
                'The email address is already in use. Please use a different email.');
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

        let error = new Meteor.Error("Not Enough Information", 
            "the provided user information is not enough to create a clinician account");
        logger.error(error, error.reason);
        throw error;
    }

    let userID;
    try {
        logger.info(`Attempting clinician creation`)
        userID = await Accounts.createUserAsync(options);
        logger.info(`successfully created clinician account for ${userID}`);
    }
    catch (error) {
        if (error.error === 403 && error.reason === 'Email already exists.') {
            throw new Meteor.Error('Email Already Exists', 
                'The email address is already in use. Please use a different email.');
        }
        else if (error instanceof Meteor.Error) {
            logger.error(error, error.reason)
            throw error;
        }
        else {
            logger.error(error, error.message);
            throw new Meteor.Error("Account-Creation-Internal-Error", "Something unexpected happened");
        }
    }
    return userID;
}

function adminHandler(options) {
    //TODO
}

export async function signupUser(userInformation){
    logger.info("beginning user creation via user.signup")

    const { email, password, role } = userInformation;

    if (!email || !password || !role) {

        let error = new Meteor.Error("Not Enough Information",
            "the provided user information is not enough for account creation.");
        logger.error(error, error.message);
        throw error;

    }
    //let userId = Accounts.createUser({ email, password, firstName, lastName, dob, phoneNumber});
    let userID;

    try {
        switch (role) {
            case UserRoles.PATIENT:
                logger.info(`patient user creation starting.`)
                userID = await patientHandler(userInformation);
                break;
            case UserRoles.CLINICIAN:
                logger.info(`clinician user creation starting.`)
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
        logger.info(`User created with id: ${userID} and role ${role}.`);   // this should be logged later on
        return userID;
    }
    catch (error) {
        if (error instanceof Meteor.Error) {
            logger.error(error, error.reason);
            throw error;
        }
    }
}

export async function updateProfile(userID, {...profileProps}) {
    const {firstName, LastName, email, password}
    try {
        logger.info(`updating profile for user: ${userID}`);
        Meteor.users.updateAsync(userID, 
            {
                $set: 
            })
    }
}

export async function isAdmin(userID) {
    try {
        return await Roles.userIsInRoleAsync(userID, UserRoles.ADMIN);
    }
    catch (error) {
        logger.error(error, "Issue checking if the user is an admin.")
        return false;
    }
    
}

export async function isClinician(userID) {
    try {
        return await Roles.userIsInRoleAsync(userID, UserRoles.CLINICIAN);
    }
    catch (error) {
        logger.error(error, "Issue checking if the user is a clinician.")
        return false;
    }
}

export async function isPatient(userID) {
    try {
        return await Roles.userIsInRoleAsync(userID, UserRoles.PATIENT);
    }
    catch (error) {
        logger.error(error, "Issue checking if the user is an patient.");
        return false;
    }
}