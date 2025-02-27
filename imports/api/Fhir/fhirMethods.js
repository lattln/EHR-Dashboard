/**
 * This file will contain functions that will be used for gathering patient fhir data from the dev fhir server.
 * these methods will take the results from the query to the server and transform it for the front end to utilize 
 * when creating graphs off of patient medical data.
 */
import { fhirClient } from './fhirclient.js';
import { Meteor } from 'meteor/meteor';
import { logger } from '../Logging/logger-config.js';
import { LOINC_MAPPING } from '../Loinc/loincConstants.js';

// takes only the useful information about the given observation
function transformObservationInformation(observationResource) 
{
    if (!observationResource || observationResource.resourceType !== "Observation")
        return null;

    return {
        loincText: observationResource.code.text,
        loincCode: observationResource.code.coding[0].code,
        dateIssued: observationResource.issued,
        valueQuantity: observationResource.valueQuantity,
    }

}
async function transformDiagonosticReportInformation(diagnosticsReportResource) {
    if(!diagnosticsReportResource || diagnosticsReportResource.resourceType !== "DiagnosticReport")
        return null;

    console.log(diagnosticsReportResource)
    let resource = {
        loincCode: diagnosticsReportResource.code.coding[0].code,
        loincText: diagnosticsReportResource.code.coding[0].display,
        dateIssued: diagnosticsReportResource.issued,
        observations: diagnosticsReportResource.result
    };

    //map referenced observations to actual resources from fhir server
    try {
        resource.observations = await Promise.all(
            resource.observations.map(async (ref) => {
                const observationID = ref.reference.split("/")[1]; //Observation/1
                const observationResource = await getPatientObservation(observationID);
                return transformObservationInformation(observationResource);
            }));
    
        return resource;
    } 
    catch (error) {
        console.error(error.message);
        throw error;
    }
    
}
function getPatientAge(birthdate) {
    const dateNow = Date.now();
    const patientBirthDateMs = Date.parse(birthdate);

    const ageDate = new Date(dateNow - patientBirthDateMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

//returns the full FHIR patient record of the specified patientID
async function getPatientRecordByID(patientID) {
    let response;

    try {
        response = await fhirClient.read({
            resourceType: "Patient",
            id: patientID
        });

        if(response.birthDate)
            response["age"] = getPatientAge(response.birthDate)
        else 
            response["age"] = "unknown";

        return response;
    } 
    catch (error) {
        console.log(error.message);
        throw error;
    }
}

/**
*   Given required user information: given name, family name, phonenumber, dob. 
*   This function will search through the fhir server to find all patient records 
*   with all matching information. If no record is found, -1 is returned. If multiple
    records are found, a list of IDs are returned. If only one record is found,
*   the id of that record is returned.
*/  
async function findPatientByInfo(patientInformation) {

    let matchedPatients = [];

    const {patientGivenName, patientFamilyName, patientPhoneNumber, patientDOB} = patientInformation;

    try {
        const searchResponse = await fhirClient.search({
            resourceType: "Patient",
            searchParams: {
                given: patientGivenName, 
                family: patientFamilyName,
                birthdate: patientDOB,
                telecom: patientPhoneNumber
            }
        });

        if(!searchResponse || !searchResponse.entry || searchResponse.total === 0)
            return -1;
    
        if(searchResponse.total === 1)
            return parseInt(searchResponse.entry[0].resource.id);
    
        for (const patient of searchResponse.entry) {
            matchedPatients.push(parseInt(patient.resource.id));
        }

        return matchedPatients;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function getPatientObservation(observationID) {
    let response;
    try {
        response = await fhirClient.read({
            resourceType: "Observation",
            id: observationID
        })

        return response;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
    
}

async function getPatientHealthMetrics(loincCode, patientID, pageNumber, count) {
    let response;
    let metrics = [];
    let offset = 0;
    
    try {

        if (pageNumber <= 0 || count <= 0) {
            return metrics;
        }

        offset = (pageNumber - 1) * count;

        response = await fhirClient.search({
            resourceType: "Observation",
            searchParams: {
                code: loincCode, 
                subject: patientID,
                _count: count,
                _offset: offset,

            },
        });

        if (!response || response.total === 0 || !response.entry) {
            return metrics;
        }
        for(let entry of response.entry){
            metrics.push(transformObservationInformation(entry.resource));
        }

        return metrics;

    } 
    catch (error) {
        console.error(error.message);
        throw error;
    }
}

/**
 * a function that pulls a given patient's diagnosticsreports from the fhir server and pulls the refrencing observations
 * so that the results can be displayed visually in the recent labs section of the client dashboard
 * @param {*} patientID 
 */
async function getRecentPatientLabs(patientID, pageNumber, count) {
    let labs = [];
    let offset = (pageNumber - 1) * count;
    try {
        let searchResponse;

        if (count <= 0 || pageNumber <= 0) {
            return labs;
        }

        searchResponse = await fhirClient.search({
            resourceType: "DiagnosticReport",
            searchParams: {
                subject: patientID,
                category: "LAB",
                _sort: "-date",
                _offset: offset,
                _count: count
            }
        });

        if (!searchResponse || searchResponse.total === 0 || !searchResponse.entry)
            return labs;

        for (let entry of searchResponse.entry) {
            labs.push(await transformDiagonosticReportInformation(entry.resource))
        }

        return labs;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }

}

Meteor.methods({
    /**
     * Retrieves patient health metrics based on LOINC code.
     * @param {string} loincCode - The LOINC code for the desired health metric.
     * @param {string} patientID - The ID of the patient.
     * @param {number} [pageNumber=1] - The page number for paginated results.
     * @param {number} [count=100] - The number of records per page.
     * @returns {Promise<Array>} A list of transformed observation metrics.
     */
    async "patient.getHealthMetrics"(loincCode, patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(loincCode, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },
    /**
     * Retrieves a full FHIR patient record by ID.
     * @param {string} patientID - The unique ID of the patient.
     * @returns {Promise<Object>} The patient's FHIR record.
     */
    async "patient.getRecordByID"(patientID) {
        this.unblock();
        try {
            return await getPatientRecordByID(patientID);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getWeightMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.BODY_WEIGHT, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getHeightMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.BODY_HEIGHT, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getHeartRateMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.BODY_HEART_RATE, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getBMIMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BMI, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getSystolicBloodPressureMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE_SYSTOLIC, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getDiastolicBloodPressureMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE_DIASTOLIC, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getBodyTempMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.BODY_TEMP, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getBodyOxygenSaturationMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.BODY_OXYGEN_SATURATION, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getHemoglobinHGBMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_HGB, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getHemoglobinA1CMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_A1C, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getErythrocyteSedimentationRateMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.ERYTHROCYTE_SEDIMENTATION_RT, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getGlucoseSerumPlasmaMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.GLUCOSE_SERUM_PLASMA, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getPotassiumSerumPlasmaMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.POTASSIUM_SERUM_PLASMA, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getCholesterolTotalMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.CHOLESTEROL_TOTAL, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getLowDensityLipoproteinMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.LOW_DENS_LIPOPROTEIN, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getHighDensityLipoproteinMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.HIGH_DENS_LIPOPROTEIN, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getUreaNitrogenBUNMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.UREA_NITROGEN_BUN, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },

    async "patient.getCreatinineMetrics"(patientID, pageNumber = 1, count = 100) {
        this.unblock();
        try {
            return await getPatientHealthMetrics(LOINC_MAPPING.CREATININE, patientID, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
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
        try {
            return await getRecentPatientLabs(patientID, labReturnLimit, pageNumber, count);
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
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
        try {
            return await findPatientByInfo({ patientGivenName, patientFamilyName, patientPhoneNumber, patientDOB });
        } catch (error) {
            throw new Meteor.Error("FHIR-Server-Error", error.message);
        }
    },
});

module.exports = { transformObservationInformation };