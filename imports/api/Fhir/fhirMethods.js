/**
 * This file will contain functions that will be used for gathering patient fhir data from the dev fhir server.
 * these methods will take the results from the query to the server and transform it for the front end to utilize 
 * when creating graphs off of patient medical data.
 */

import { Meteor } from 'meteor/meteor';
import { LOINC_MAPPING } from '../Loinc/loincConstants.js';

Meteor.methods({
    /**
     * Retrieves patient health metrics based on LOINC code.
     * @param {string or array[string]} loincCode - The LOINC code for the desired health metric. Can include a list of loincCodes.
     * @param {string} patientID - The ID of the patient.
     * @param {number} [pageNumber=1] - The page number for paginated results.
     * @param {number} [count=100] - The number of records per page.
     * @returns {Promise<Array>} A list of transformed observation metrics.
     */
    async "patient.getHealthMetrics"(loincCode, patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if(!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if(this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const patientFhirID = await getFhirIDFromUserAccount(patientID);

            if(patientFhirID === undefined) {
                throw new Meteor.Error("Access-Error", "There is no associated fhir id with the account");
            }

            try {
                return await getPatientHealthMetrics(loincCode, patientFhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },
    /**
     * Retrieves a full FHIR patient record by ID.
     * @param {string} patientID - The unique ID of the patient.
     * @returns {Promise<Object>} The patient's FHIR record.
     */
    async "patient.getRecordByID"(patientID) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientRecordByID } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientRecordByID(patientID);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getWeightMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_WEIGHT, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getHeightMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if(!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }
            
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_HEIGHT, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getHeartRateMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if(!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_HEART_RATE, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getBMIMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BMI, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
       
    },
    
    async "patient.getBloodPressureMetrics"(patientID, pageNumber = 1, count = 100) {

        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getBodyTempMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_TEMP, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }    
        }
    },

    async "patient.getBodyOxygenSaturationMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_OXYGEN_SATURATION, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getHemoglobinHGBMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_HGB, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getHemoglobinA1CMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_A1C, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getErythrocyteSedimentationRateMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.ERYTHROCYTE_SEDIMENTATION_RT, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getGlucoseSerumPlasmaMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.GLUCOSE_SERUM_PLASMA, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getPotassiumSerumPlasmaMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.POTASSIUM_SERUM_PLASMA, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getCholesterolTotalMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.CHOLESTEROL_TOTAL, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },

    async "patient.getLowDensityLipoproteinMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.LOW_DENS_LIPOPROTEIN, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },

    async "patient.getHighDensityLipoproteinMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.HIGH_DENS_LIPOPROTEIN, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },

    async "patient.getUreaNitrogenBUNMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.UREA_NITROGEN_BUN, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },

    async "patient.getCreatinineMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.CREATININE, fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },
    /**
     * Retrieves the most recent lab reports for a patient.
     * @param {string} patientID - The unique ID of the  patient user account.
     * @param {number} pageNumber - The page number with count number of objects.
     * @param {number} [count=100] - The maximum number of lab reports to retrieve per page.
     * @returns {Promise<Array>} A list of recent diagnostic reports.
     */
    async "patient.getRecentLabs"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getRecentPatientLabs } = await import("./Server/FhirUtils.js");
            let { isPatient, isAdmin, isClinician, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            if (this.userId === null || await isAdmin(this.userId) || (await isClinician(this.userId) && !await hasPatientRecordAccess(this.userId, patientID))){
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            if(await isPatient(this.userId) && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized", "The User is not authorized to access this record.");
            }

            const fhirID = await getFhirIDFromUserAccount(patientID);

            if(fhirID === undefined){
                throw new Meteor.Error("Access-Error", "The Provided ID does not have an associated fhir id mapping.")
            }

            try {
                return await getRecentPatientLabs(fhirID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },
    /**
     * Searches for a patient by given name, family name, phone number, and date of birth.
     * @param {Object} patientInfo - An object containing patient search criteria.
     *      @param {string} patientInfo.patientGivenName - The given name of the patient.
     *      @param {string} patientInfo.patientFamilyName - The family name of the patient.
     *      @param {string} patientInfo.patientPhoneNumber - The patient's phone number.
     *      @param {string} patientInfo.patientDOB - The patient's date of birth.
     * @returns {Promise<number|Array>} The patient ID if a single record is found, a list of IDs if multiple records are found, or -1 if no record is found.
     */
    async "patient.findByInfo"({ patientGivenName, patientFamilyName, patientPhoneNumber, patientDOB }) {
        this.unblock();
        if (!this.isSimulation) {
            let { findPatientByInfo } = await import("./Server/FhirUtils.js");
            try {
                return await findPatientByInfo({ patientGivenName, patientFamilyName, patientPhoneNumber, patientDOB });
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },
});
