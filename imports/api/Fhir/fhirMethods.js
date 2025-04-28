/**
 * This file will contain functions that will be used for gathering patient fhir data from the dev fhir server.
 * these methods will take the results from the query to the server and transform it for the front end to utilize 
 * when creating graphs off of patient medical data.
 */

import { Meteor } from 'meteor/meteor';
import { LOINC_MAPPING } from '../Loinc/loincConstants.js';
import { UserRoles } from '../User/userRoles.js';

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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
                throw new Meteor.Error("Not-Authorized");
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
            let { getRoles, hasPatientRecordAccess, getFhirIDFromUserAccount} = await import("./../User/Server/UserUtils.js");

            let [hasAccess, roles] = await Promise.all([hasPatientRecordAccess(this.userId, patientID), getRoles(this.userId)]);

            const isAdminUser = roles.includes(UserRoles.ADMIN);
            const isUserPatient = roles.includes(UserRoles.PATIENT);
            const isClinicianUser = roles.includes(UserRoles.CLINICIAN);
            const hasRole = roles.size !== 0;

            if(this.userId === null || isAdminUser || (isClinicianUser && !hasAccess) || !hasRole) {
                throw new Meteor.Error("Not-Authorized");
            }

            if(isUserPatient && this.userId !== patientID) {
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
    async "patient.getSummaryMetrics"(patientID, pageNumber = 1, count = 100) {
        const latestValue = (res) => {
            if (!res || res.length == 0) return null
            return res[res.length - 1].valueQuantities[0].value
        };

        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                const [
                    weightMetrics,
                    heightMetrics,
                    systolicMetrics,
                    diastolicMetrics,
                    heartRateMetrics,
                    BMIMetrics,
                    bodyTempMetrics,
                    oxygenSaturationMetrics,
                    hemoglobinMetrics,
                    hemoglobinA1CMetrics,
                    ESRMetrics,
                    glucoseMetrics,
                    potassiumMetrics,
                    cholesterolTotalMetrics,
                    LDLMetrics,
                    HDLMetrics,
                    BUNMetrics,
                    creatinineMetrics
                ] = await Promise.all([
                    getPatientHealthMetrics(LOINC_MAPPING.BODY_WEIGHT, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.BODY_HEIGHT, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE_SYSTOLIC, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE_DIASTOLIC, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.BODY_HEART_RATE, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.BODY_BMI, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.BODY_TEMP, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.BODY_OXYGEN_SATURATION, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_HGB, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_A1C, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.ERYTHROCYTE_SEDIMENTATION_RT, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.GLUCOSE_SERUM_PLASMA, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.POTASSIUM_SERUM_PLASMA, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.CHOLESTEROL_TOTAL, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.LOW_DENS_LIPOPROTEIN, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.HIGH_DENS_LIPOPROTEIN, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.UREA_NITROGEN_BUN, patientID, pageNumber, count),
                    getPatientHealthMetrics(LOINC_MAPPING.CREATININE, patientID, pageNumber, count)
                ]);

                const payload = {
                    age: 40,
                    gender: 'male',
                    weight: latestValue(weightMetrics),
                    height: latestValue(heightMetrics),
                    bloodPressure: {
                        systolic: latestValue(systolicMetrics),
                        diastolic: latestValue(diastolicMetrics),
                    },
                    heartRate: latestValue(heartRateMetrics),
                    BMI: latestValue(BMIMetrics),
                    labResults: {
                        bodyTemp: latestValue(bodyTempMetrics),
                        oxygenSaturation: latestValue(oxygenSaturationMetrics),
                        hemoglobin: latestValue(hemoglobinMetrics),
                        hemoglobinA1C: latestValue(hemoglobinA1CMetrics),
                        ESR: latestValue(ESRMetrics),
                        glucose: latestValue(glucoseMetrics),
                        potassium: latestValue(potassiumMetrics),
                        cholesterolTotal: latestValue(cholesterolTotalMetrics),
                        LDL: latestValue(LDLMetrics),
                        HDL: latestValue(HDLMetrics),
                        BUN: latestValue(BUNMetrics),
                        creatinine: latestValue(creatinineMetrics),
                    },
                };

                let prompt = 
                    `2-4 sentences, speak directly to the patient using "you" and "your" and offer brief advice. Be optimistic. Wrap important values in <strong> tags.\n` +
                    `Data: A:${payload.age} G:${payload.gender} W:${payload.weight}kg H:${payload.height}cm BP:${payload.bloodPressure.systolic}/${payload.bloodPressure.diastolic}` +
                    (payload.heartRate   ? ` HR:${payload.heartRate}` : '') +
                    (payload.BMI         ? ` BMI:${payload.BMI}` : '') +
                    (payload.labResults
                        ? ` L:${[
                            payload.labResults.bodyTemp       && `T${payload.labResults.bodyTemp}`,
                            payload.labResults.oxygenSaturation&& `O${payload.labResults.oxygenSaturation}`,
                            payload.labResults.hemoglobin      && `HGB${payload.labResults.hemoglobin}`,
                            payload.labResults.hemoglobinA1C   && `A1C${payload.labResults.hemoglobinA1C}`,
                            payload.labResults.ESR             && `ESR${payload.labResults.ESR}`,
                            payload.labResults.glucose         && `Glu${payload.labResults.glucose}`,
                            payload.labResults.potassium       && `K${payload.labResults.potassium}`,
                            payload.labResults.cholesterolTotal&& `Chol${payload.labResults.cholesterolTotal}`,
                            payload.labResults.LDL             && `LDL${payload.labResults.LDL}`,
                            payload.labResults.HDL             && `HDL${payload.labResults.HDL}`,
                            payload.labResults.BUN             && `BUN${payload.labResults.BUN}`,
                            payload.labResults.creatinine      && `Cr${payload.labResults.creatinine}`,
                            ].filter(Boolean).join(',')}`
                        : '') +
                    ` S:`;
                
                return prompt;
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },
    async "patient.getLabSummary"(patientID, pageNumber = 1, count = 100) {
        this.unblock();

        function formatLabData(panels) {
            return panels
                .flatMap(panel => panel.observations)
                .map(obs => {
                    const code = obs.loincCode;                   // 6690-2
                    const { value, unit } = obs.valueQuantities[0];
                    const v    = Math.round(value * 10) / 10;      // round to 1 decimal
                    return `${code}${v}${unit}`;                  // 6690-24.3x10*3/uL
                })
                .join(',');
        }

        const payload = await Meteor.callAsync("patient.getRecentLabs", patientID, pageNumber, count);
        if (!this.isSimulation) {
            try {
                let prompt = 
                    `2-4 sentences simplifying the lab, speak directly to the patient using "you" and "your". Try not to use too many numbers and units. Wrap important values in <strong> tags.\n` +
                    `Lab data: ${JSON.stringify(formatLabData(payload))}`

                return prompt
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    }
});
