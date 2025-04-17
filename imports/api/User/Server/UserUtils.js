import { Meteor } from 'meteor/meteor'; 
import { Roles } from 'meteor/alanning:roles';
import { UserRoles } from "../userRoles.js"
import {findPatientByInfo} from '../../Fhir/Server/FhirUtils.js';
import { logger } from "../../Logging/Server/logger-config.js";
import { TypeCheck } from '../../Validator/typechecking.js';

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
        
        let error =  new Meteor.Error("Not-Enough-Information", 
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
        throw new Meteor.Error("Patient-Not-Found", 
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
        logger.info(`Patient User: ${userID} has successfully been created`);
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
        userID = await Accounts.createUserAsync(options);
        logger.info(`successfully created clinician account for ${userID}`);
    }
    catch (error) {
        if (error.error === 403 || error.reason === 'Email already exists.') {
            throw new Meteor.Error('Email-Already-Exists', 
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
    logger.info('beginning user creation via user.signup"')

    const { email, password, role } = userInformation;

    if (!email || !password || !role) {

        let error = new Meteor.Error("Not-Enough-Information",
            "the provided user information is not enough for account creation.");
        logger.error(error, error.message);
        throw error;

    }
    //let userId = Accounts.createUser({ email, password, firstName, lastName, dob, phoneNumber});
    let userID;

    try {
        switch (role) {
            case UserRoles.PATIENT:
                userID = await patientHandler(userInformation);
                break;
            case UserRoles.CLINICIAN:
                userID = await clinicianHandler(userInformation);
                break;
            case UserRoles.ADMIN:
                throw new Meteor.Error("Not-Authorized",
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
    
    if(!userID || !firstName || !lastName || phoneNumber) {
        throw new Meteor.Error("Invalid-Account-Updating", "Missing Required properties to update the account. Cannot have undefined properties.")
    }
    logger.info(`Attempting Updating profile for user: ${userID}`);
    try {
        await Meteor.users.updateAsync({_id: userID}, 
            {
                $set: {"profile.firstName": firstName, "profile.lastName":lastName,  fitbitAccountAuth: fitbitAccountAuth || null, "profile.phoneNumber": phoneNumber}
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
        if(error instanceof Meteor.Error) {
            throw error;
        }
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
        throw new Meteor.Error("Config-Update-Failed", error.message)
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

export async function getRoles(userID){
    try {
        return await Roles.getRolesForUserAsync(userID);

    } catch (error) {
        logger.error(error, `Issue retrieving roles for ${userID}`);
    }
    return [];
}

export async function addUsersToRoles(adminUserID, usersList, rolesList) {
    if(!usersList || !Array.isArray(usersList)) {
        const error = new Meteor.Error("Promoting-User-Error", "usersList is either undefined or not an array.");
        logger.error(error);
        throw error;
    }
    if(!rolesList || !Array.isArray(rolesList)) {
        const error = new Meteor.Error("Promoting-User-Error", "rolesList is either undefined or not an array.");
        logger.error(error);
        throw error;
    }
    
    try {
        await Roles.setUserRolesAsync(usersList, rolesList);
        logger.info({admin: adminUserID, usersList, rolesList}, `User: ${adminUserID} added users to roles.`);
    } catch (error) {
        logger.error(error, `Issue adding users: ${usersList} to roles: ${rolesList}`);
        throw new Meteor.Error("Promote-User-Error", error.message);
    }
}

export async function removeUsersFromRoles(adminUserID, usersList, rolesList) {

    if(!usersList || !Array.isArray(usersList)) {
        const error = new Meteor.Error("Promoting-User-Error", "usersList is either undefined or not an array.");
        logger.error(error);
        throw error;
    }
    if(!rolesList || !Array.isArray(rolesList)) {
        const error = new Meteor.Error("Promoting-User-Error", "rolesList is either undefined or not an array.");
        logger.error(error);
        throw error;
    }

    try {
        await Roles.removeUsersFromRolesAsync(usersList, rolesList);
        logger.info({admin: adminUserID, usersList, rolesList}, `User: ${adminUserID} removed users from roles.`);
    } catch (error) {
        logger.error(error, `Issue removing users: ${usersList} from roles: ${rolesList}`);
        throw new Meteor.Error("Demote-User-Error", error.message);
    }
}

export async function isRootAdmin(userID){
    const userObj = await Meteor.users.findOneAsync({_id: userID});

    if(TypeCheck.isUndefined(userObj))
        return false;

    if(await isAdmin(userID) && userObj.username === "ROOT"){
        return true;
    }

    return false;
}

export async function addClinicianToPatient(userPatientID, userClinicianID) {
    if (!userPatientID || !userClinicianID) {
        throw new Meteor.Error("Add-Clinician-Error", "Provided arguments are undefined.");
    }

    try {
        await Promise.all([
            Meteor.users.updateAsync({ _id: userPatientID }, { $addToSet: { clinicians: userClinicianID } }),
            Meteor.users.updateAsync({ _id: userClinicianID }, { $addToSet: { patients: userPatientID } })
        ]);

        logger.info(
            { patient: userPatientID, clinician: userClinicianID, action: "Added patient and clinician to each other's list." },
            `Added patient ${userPatientID} and clinician ${userClinicianID} to each other's lists.`
        );

    } catch (error) {
        logger.error(error, `Issue adding clinician: ${userClinicianID} to patient: ${userPatientID}`);

        if (error instanceof Meteor.Error) {
            throw new Meteor.Error("Add-Clinician-Error", error.reason);
        }

        throw new Meteor.Error("Add-Clinician-Error", error.message);
    }
}

export async function getFhirIDFromUserAccount(userPatientID) {
    try {
        const user = await Meteor.users.findOneAsync(
            { _id: userPatientID },
            { fields: { fhirID: 1 } }
          );
          return user?.fhirID;
    } catch (error) {
        logger.error(error, `An error occured while trying to get the fhir id of the specified user id: ${userPatientID}.`);
        return undefined;
    }
}

export async function hasPatientRecordAccess(userClinicianID, userPatientID) {
    try {
        const listOfPatients = await (Meteor.users.findOneAsync({_id: userClinicianID}, {fields: {patients: 1}}))?.patients || [];
        return listOfPatients.includes(userPatientID);

    } catch (error) {
        return false;
    }
}


export async function removeClinicianFromPatient(userPatientID, userClinicianID) {
    if (!userPatientID || !userClinicianID) {
        logger.error(`Invalid arguments: userPatientID: ${userPatientID}, userClinicianID: ${userClinicianID}`);
        throw new Meteor.Error("Remove-Clinician-Error", "Provided arguments are undefined.");
    }

    try {
        const patientUpdate = Meteor.users.updateAsync(
            { _id: userPatientID },
            { $pull: { clinicians: userClinicianID } }
        );

        const clinicianUpdate = Meteor.users.updateAsync(
            { _id: userClinicianID },
            { $pull: { patients: userPatientID } }
        );

        await Promise.all([patientUpdate, clinicianUpdate]);

        logger.info(
            { patient: userPatientID, clinician: userClinicianID },
            `Successfully removed clinician ${userClinicianID} from patient ${userPatientID}'s list and vice versa.`
        );

    } catch (error) {
        logger.error(error, `Issue removing clinician: ${userClinicianID} from patient: ${userPatientID}`);

        if (error instanceof Meteor.Error) {
            throw new Meteor.Error("Remove-Clinician-Error", error.reason);
        }
        throw new Meteor.Error("Remove-Clinician-Error", error.message);
    }
}

