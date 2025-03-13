import { Meteor } from 'meteor/meteor'; 
import { Roles } from 'meteor/alanning:roles';


Meteor.methods({
    async 'user.signup'(userInformation) {
        if (!this.isSimulation) {
            let { signupUser } = await import("./Server/UserUtils.js");
            try {
                return await signupUser(userInformation)
            } catch (error) {
                console.log(error.reason)
                throw error;
            }
        }
        
    },

    async 'user.assignRolesToUsers'(userIDsList, rolesList) {
        if(!this.isSimulation) {
            let { addUsersToRoles, isAdmin} = await import("./Server/UserUtils.js");
            try {
                if(this.userId && await isAdmin(this.userId)){
                    await addUsersToRoles(this.userId, userIDsList, rolesList);
                } else {
                    throw new Meteor.Error("not-authorized");
                }
            } catch (error) {
                throw error;
            }
        }
    },

    async 'user.removeRolesFromUsers'(userIDsList, rolesList) {

        if(!this.isSimulation) {
            let { removeUsersFromRoles, isAdmin} = await import("./Server/UserUtils.js");
            try {
                if(this.userId && await isAdmin(this.userId)){
                    await removeUsersFromRoles(this.userId, userIDsList, rolesList);
                } else {
                    throw new Meteor.Error("not-authorized");
                }
            } catch (error) {
                throw error;
            }
        }
    },

    async 'user.updateProfile'({firstName, lastName, fitbitAccountAuth}) {
        if(!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        if (!this.isSimulation) {
            let { updateProfile } = await import("./Server/UserUtils.js");
            try {
                await updateProfile(Meteor.userId(), {firstName, lastName, fitbitAccountAuth});
            } catch (error) {
                throw error;
            }
        }
    },

    async 'user.updateEmail'(email){

        if(!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        if(!this.isSimulation) {
            let { updateEmail } = await import("./Server/UserUtils.js");
            try {
                await updateEmail(Meteor.userId(), email);
            } catch (error) {
                throw error;
            }
        }
    },

    async 'user.addClinician'(clinicianUserID){
        if(!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        if(!this.isSimulation) {
            let {addClinicianToPatient, isPatient, isClinician} = await import("./Server/UserUtils.js");

            try {
                if(await isPatient(this.userId) && await isClinician(clinicianUserID)) {
                    await addClinicianToPatient(this.userId, clinicianUserID);
                } else {
                    throw new Meteor.Error("Add-Clinician-Error", "User is either not a patient or the clinicianID is not a registered clinician.")
                }

            } catch (error) {
                throw error;
            }
        }
    },

    async 'user.removeClinician'(clinicianUserID){
        if(!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        if(!this.isSimulation) {

            let {removeClinicianFromPatient, isPatient, isClinician } = await import("./Server/UserUtils.js");

            try {
                if(await isPatient(this.userId) && await isClinician(clinicianUserID)) {
                    await removeClinicianFromPatient(this.userId, clinicianUserID);
                } else {
                    throw new Meteor.Error("Add-Clinician-Error", "User is either not a patient or the clinicianID is not a registered clinician.")
                }
                
            } catch (error) {
                throw error;
            }
        }
    }

});