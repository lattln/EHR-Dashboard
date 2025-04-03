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
            try {
                return await getPatientHealthMetrics(loincCode, patientID, pageNumber, count);
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
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_WEIGHT, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getHeightMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if(!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_HEIGHT, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getHeartRateMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if(!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_HEART_RATE, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getBMIMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BMI, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
       
    },
    
    async "patient.getBloodPressureMetrics"(patientID, pageNumber = 1, count = 100) {

        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getBodyTempMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_TEMP, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }    
        }
    },

    async "patient.getBodyOxygenSaturationMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.BODY_OXYGEN_SATURATION, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getHemoglobinHGBMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_HGB, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getHemoglobinA1CMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_A1C, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getErythrocyteSedimentationRateMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.ERYTHROCYTE_SEDIMENTATION_RT, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getGlucoseSerumPlasmaMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.GLUCOSE_SERUM_PLASMA, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getPotassiumSerumPlasmaMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.POTASSIUM_SERUM_PLASMA, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
        
    },

    async "patient.getCholesterolTotalMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.CHOLESTEROL_TOTAL, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },

    async "patient.getLowDensityLipoproteinMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.LOW_DENS_LIPOPROTEIN, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },

    async "patient.getHighDensityLipoproteinMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.HIGH_DENS_LIPOPROTEIN, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },

    async "patient.getUreaNitrogenBUNMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.UREA_NITROGEN_BUN, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },

    async "patient.getCreatinineMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getPatientHealthMetrics } = await import("./Server/FhirUtils.js");
            try {
                return await getPatientHealthMetrics(LOINC_MAPPING.CREATININE, patientID, pageNumber, count);
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    },
    /**
     * Retrieves the most recent lab reports for a patient.
     * @param {string} patientID - The unique ID of the patient.
     * @param {number} pageNumber - The page number with count number of objects.
     * @param {number} [count=100] - The maximum number of lab reports to retrieve per page.
     * @returns {Promise<Array>} A list of recent diagnostic reports.
     */
    async "patient.getRecentLabs"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        if (!this.isSimulation) {
            let { getRecentPatientLabs } = await import("./Server/FhirUtils.js");
            try {
                return await getRecentPatientLabs(patientID, pageNumber, count);
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
                return {
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
                };
            } catch (error) {
                throw new Meteor.Error("FHIR-Server-Error", error.message);
            }
        }
    }
});
