import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { logger } from '../../Logging/Server/logger-config';
import { TypeCheck } from '../../Validator/typechecking';
import { UserRoles } from '../userRoles';
import { isRootAdmin, removeClinicianFromPatient } from './UserUtils';


export async function addUsersToRoles(adminUserID, usersList, rolesList) {

    try {
        await Roles.addUsersToRolesAsync(usersList, rolesList);
        logger.info({ admin: adminUserID, usersList, rolesList }, `User: ${adminUserID} added users to roles.`);
    } catch (error) {
        logger.error(error, `Issue adding users: ${usersList} to roles: ${rolesList}`);
        throw new Meteor.Error("Promote-User-Error", error.message);
    }
}

export async function removeUsersFromRoles(adminUserID, usersList, rolesList) {

    try {
        await Roles.removeUsersFromRolesAsync(usersList, rolesList);
        logger.info({ admin: adminUserID, usersList, rolesList }, `User: ${adminUserID} removed users from roles.`);
    } catch (error) {
        logger.error(error, `Issue adding users: ${usersList} to roles: ${rolesList}`);
        throw new Meteor.Error("Demote-User-Error", error.message);
    }
}

export async function removeUser(adminUserID, userID) {
    try {
        const userRoles = await Roles.getRolesForUserAsync(userID);
        const userObj = await Meteor.users.findOneAsync({ _id: userID });

        if (TypeCheck.isEmptyArray(userRoles)) {
            await removeUserFromDB(adminUserID, userID);
            return;
        }

        if (userRoles.includes(UserRoles.ADMIN)) {
            const isRoot = await isRootAdmin(adminUserID);
            if (isRoot) {
                await removeUserFromDB(adminUserID, userID, "admin");
            } else {
                logger.warn(`Admin user: ${adminUserID} attempted to remove another admin account: ${userID}`);
            }
            return;
        }

        if (userRoles.includes(UserRoles.CLINICIAN)) {
            for (const patientID of userObj?.patients || []) {
                await removeClinicianFromPatient(patientID, userID);
            }
            await removeUserFromDB(adminUserID, userID, "clinician");
            return;
        }

        if (userRoles.includes(UserRoles.PATIENT)) {
            for (const clinicianID of userObj?.clinicians || []) {
                await removeClinicianFromPatient(userID, clinicianID);
            }
            await removeUserFromDB(adminUserID, userID, "patient");
            return;
        }

    } catch (error) {
        logger.error(error, `Issue removing ${userID}`);
        throw error;
    }
}

export async function removeUserFromDB(adminUserID, userID, role = "user") {
    await Meteor.users.removeAsync({ _id: userID });
    logger.info(`Admin user: ${adminUserID} removed ${role}:${userID} from the users database.`);
}

