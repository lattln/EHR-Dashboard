/**
 * This file will contain functions that will be used for gathering patient fhir data from the dev fhir server.
 * these methods will take the results from the query to the server and transform it for the front end to utilize 
 * when creating graphs off of patient medical data.
 */
const fhirClient = require('./fhirclient.js');
const {Meteor} = require('meteor/meteor');
const {LOINC_MAPPING} = require('./../Loinc/loincConstants.js');

// takes only the useful information about the given observation
function transformObservationInformation(observationResource) 
{
    if (!observationResource || observationResource.resourceType !== "Observation")
        return null;

    return {
        loincText: observationResource.code.text,
        loincCode: observationResource.code.coding.code,
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
    resource.observations = await Promise.all(
        resource.observations.map(async (ref) => {
            const observationID = ref.reference.split("/")[1]; //Observation/1
            const observationResource = await getPatientObservation(observationID);
            return transformObservationInformation(observationResource);
        }));

    return resource;
}

//returns the full FHIR patient record of the specified patientIdentifier
//The patientIdentifier is not the id that the record is stored under but rather the identifier[0].value
async function getPatientRecordByID(patientID) {
    let response = await fhirClient.read({
        resourceType: "Patient",
        id: patientIdentifier
    });
     
    return response;
}

async function getPatientObservation(observationID) {
    let response;
    try {
        response = await fhirClient.read({
            resourceType: "Observation",
            id: observationID
        })
    }
    catch (error) {
        console.log(error.message)
    }
    
    return response;
}

async function getPatientHealthMetrics(loincCode, patientID) {
    let response;
    let metrics = [];
    
    try {
        response = await fhirClient.search({
            resourceType: "Observation",
            searchParams: {code: loincCode, subject: patientID},
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
    }

    return metrics;
}

/**
 * a function that pulls a given patient's diagnosticsreports from the fhir server and pulls the refrencing observations
 * so that the results can be displayed visually in the recent labs section of the client dashboard
 * @param {*} patientID 
 */
async function getRecentPatientLabs(patientID, labReturnLimit=100) {
    let labs = [];
    try {
        let searchResponse;

        searchResponse = await fhirClient.search({
            resourceType: "DiagnosticReport",
            searchParams: {
                subject: patientID,
                category: "LAB",
                _sort: "-date",
                _count: labReturnLimit
            }
        });

        if (!searchResponse || searchResponse.total === 0 || !searchResponse.entry)
            return labs;

        for (let entry of searchResponse.entry) {
            labs.push(await transformDiagonosticReportInformation(entry.resource))
        }

        for await (const lab of labs) {
            let observations = [];

            for (const observation of lab.observations) {
                
                let result = await getPatientObservation(observation.reference.split("/").pop())
                observations.push({
                    loincText: result.code.text,
                    loincCode: result.code.coding.code,
                    dateIssued: result.issued,
                    valueQuantity: result.valueQuantity
                })
            }
            lab.observations = observations;
        }
    }
    catch (error) {
        console.log(error.message);
    }
    return labs

}

Meteor.methods({
    async "patient.getHealthMetrics"(loincCode, patientID) {
        this.unblock();
        return await getPatientHealthMetrics(loincCode, patientID);
    },
    async "patient.getRecordByID"(patientID) {
        this.unblock();
        return await getPatientRecordByID(patientID);
    },
    async "patient.getWeightMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.BODY_WEIGHT, patientID);
    },
    async "patient.getHeightMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.BODY_HEIGHT, patientID);
    },
    async "patient.getHeartRateMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.BODY_HEART_RATE, patientID);
    },
    async "patient.getBMIMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BMI, patientID);
    },
    async "patient.getSystolicBloodPressureMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE_SYSTOLIC, patientID);
    },
    async "patient.getDiastolicBloodPressureMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE_DIASTOLIC, patientID);
    },
    async "patient.getBodyTempMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.BODY_TEMP, patientID);
    },
    async "patient.getBodyOxygenSaturationMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.BODY_OXYGEN_SATURATION, patientID);
    },
    async "patient.getHemoglobinHGBMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_HGB, patientID);
    },
    async "patient.getHemoglobinA1CMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_A1C, patientID);
    },
    async "patient.getErythrocyteSedimentationRateMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.ERYTHROCYTE_SEDIMENTATION_RT, patientID);
    },
    async "patient.getGlucoseSerumPlasmaMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.GLUCOSE_SERUM_PLASMA, patientID);
    },
    async "patient.getPotassiumSerumPlasmaMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.POTASSIUM_SERUM_PLASMA, patientID);
    },
    async "patient.getCholesterolTotalMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.CHOLESTEROL_TOTAL, patientID);
    },
    async "patient.getLowDensityLipoproteinMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.LOW_DENS_LIPOPROTEIN, patientID);
    },
    async "patient.getHighDensityLipoproteinMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.HIGH_DENS_LIPOPROTEIN, patientID);
    },
    async "patient.getUreaNitrogenBUNMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.UREA_NITROGEN_BUN, patientID);
    },
    async "patient.getCreatinineMetrics"(patientID) {
        this.unblock();
        return await getPatientHealthMetrics(LOINC_MAPPING.CREATININE, patientID);
    },

    async "patient.getRecentLabs"(patientID, labReturnLimit=100) {
        this.unblock();
        return await getRecentPatientLabs(patientID, labReturnLimit);
    },

    async "patient.findPatient"({patientName, patientPhoneNumber, patientDOB}) {
        this.unblock();
        
    },
});
