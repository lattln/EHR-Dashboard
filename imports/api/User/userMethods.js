import { Meteor } from 'meteor/meteor'; 
import { Roles } from 'meteor/alanning:roles';
import {SchemaBuilder, Validator} from "./../Validator/validator.js"


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

    async 'user.updateProfile'({firstName, lastName, fitbitAccountAuth}) {
        if(!Meteor.userId()) {
            throw new Meteor.Error("Not-Authorized");
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
    /*
    config is expected to be in the form:
        {
            config1: [],
            config2: [],
            config3: [],
            ...
        }
    */
    async 'user.saveDashboardConfig'(config){
        if (!Meteor.userId()){
            throw new Meteor.Error("Not-Authorized");
        }

        if(!this.isSimulation) {
            let { updateConfig } = await import("./Server/UserUtils.js");
            
            try {
                await updateConfig(this.userId, config)
            } catch (error) {
                throw error
            }
        }
    },

    async 'user.updateEmail'(email){

        if(!Meteor.userId()) {
            throw new Meteor.Error("Not-Authorized");
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
            throw new Meteor.Error("Not-Authorized");
        }

        if(!this.isSimulation) {
            let {addClinicianToPatient, isPatient, isClinician} = await import("./Server/UserUtils.js");

            try {
                let [isPatientUser, isClinicianUser] = await Promise.all([isPatient(this.userId), isClinician(clinicianUserID)]);
                if(isPatientUser && isClinicianUser) {
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
            throw new Meteor.Error("Not-Authorized");
        }

        if(!this.isSimulation) {

            let {removeClinicianFromPatient, isPatient, isClinician } = await import("./Server/UserUtils.js");
            let [isPatientUser, isClinicianUser] = await Promise.all([isPatient(this.userId), isClinician(clinicianUserID)]);
            try {
                if(isPatientUser && isClinicianUser) {
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