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
        if (error.error === 403 || error.reason === 'Email already exists.') {
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
        if (error.error === 403 || error.reason === 'Email already exists.') {
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
    const {firstName, lastName, fitbitAccountAuth} = profileProps;
    
    if(!userID || !firstName || !lastName) {
        throw new Meteor.Error("Invalid-Account-Updating", "Missing Required properties to update the account. Cannot have undefined properties.")
    }
    logger.info(`Attempting Updating profile for user: ${userID}`);
    try {
        await Meteor.users.updateAsync({_id: userID}, 
            {
                $set: {"profile.firstName": firstName, "profile.lastName":lastName,  fitbitAccountAuth: fitbitAccountAuth || null}
            })
        logger.info(`Profile updated successfully for user: ${userID}`);

    } catch (error) {
        logger.error(error, `Error when trying to update profile for User:${userID}`);
        throw new Meteor.Error('Profile-Update-Failed', `Error updating profile for user: ${userID}`, error.message);
    }
}

export async function updateEmail(userID, email) {

    if (!userID || !email) {
        throw new Meteor.Error("Invalid-Account-Updating", "Missing required properties to update the email. Cannot have undefined arguments.");
    }

    logger.info(`Attempting Updating email for user: ${userID}`);
    try {

        const existingUser = await Meteor.users.findOneAsync({ "emails.0.address": email });
        if (existingUser && existingUser._id !== userID) {
            logger.warn(`User: ${userID} tried updating to an email address that already is associated with another user.`)
            throw new Meteor.Error("Email-Taken", "The email address is already taken by another user.");
        }

        await Meteor.users.updateAsync({_id: userID}, {
            $set: {
                "emails.0": {address: email, verified: false}
            }
        });
        logger.info(`Successfully updated User: ${userID} email address to ${email}`);
        
    } catch (error) {
        logger.error(error, `Error when trying to update email for ${userID}`)
        throw new Meteor.Error("Email-Update-Failed", error.message);
    }
}

export async function updateConfig(userID, config) {
    if (!userID || !config) {
        throw new Meteor.Error("Invalid-Account-Updating", "Missing required properties to update the dashboard config. Cannot have undefined arguments.");
    }

    logger.info(`Attempting updating dashboard config for User: ${userID}`);
    try {
        await Meteor.users.updateAsync({_id: userID}, {
            $set: config
        });
        logger.info(`Successfully updated dashboard config for User: ${userID}`);

    } catch (error) {
        logger.error(error, `Error when trying to update config for ${userID}`);
        throw new Meteor.error("Config-Update-Failed", error.message)
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
        logger.error(error, "Issue checking if the user is a patient.");
        return false;
    }
}