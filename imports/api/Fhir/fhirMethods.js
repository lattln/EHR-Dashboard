/**
 * This file will contain functions that will be used for gathering patient fhir data from the dev fhir server.
 * these methods will take the results from the query to the server and transform it for the front end to utilize 
 * when creating graphs off of patient medical data.
 */
const {fhirClient} = require(`./fhirclient.js`);
const {Meteor} = require(`meteor/meteor`);
const {LOINC_MAPPING} = require(`./../Loinc/loincConstants.js`);
//temporary mapping

// takes only the useful information about the given observation
function transformObservationInformation(response)
{
    let metrics = [];

    if (!response || response.total === 0 || !response.entry) {
        return metrics;
    }

    for(let entry of response.entry){
        metrics.push({
            dateIssued: entry.resource.issued,
            valueQuantity: entry.resource.valueQuantity
        });
    }
    return metrics;

}

//returns the full FHIR patient record of the specified patientIdentifier
//The patientIdentifier is not the id that the record is stored under but rather the identifier[0].value
async function getPatientRecordByIdentifier(patientIdentifier) {
    let response = await fhirClient.search({
        resourceType: "Patient",
        searchParams: {identifier: patientIdentifier}
    });
     
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
        metrics = transformObservationInformation(response)

    } 
    catch (error) {
        console.error(error.message);
    }

    return metrics;
}

async function getPatientWeightMetrics(patientID) {
    return await getPatientHealthMetrics(LOINC_MAPPING.BODY_WEIGHT, patientID);
}

async function getPatientHeightMetrics(patientID) {
    return await getPatientHealthMetrics(LOINC_MAPPING.BODY_HEIGHT, patientID);
}

async function getPatientBMIMetrics(patientID) {
    return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BMI, patientID);
}

async function getPatientHeartRateMetrics(patientID) {
    return await getPatientHealthMetrics(LOINC_MAPPING.BODY_HEART_RATE, patientID);
}

async function getPatientSystolicBloodPressureMetrics(patientID) {
    return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE_SYSTOLIC, patientID);
}

async function getPatientDiastolicBloodPressureMetrics(patientID) {
    return await getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE_DIASTOLIC, patientID);
}

async function getPatientBodyTempMetrics(patientID) {
    return await getPatientHealthMetrics(LOINC_MAPPING.BODY_TEMP, patientID);
}

Meteor.methods({
    async "patient.getHealthMetrics"(loincCode, patientID){
        this.unblock();
        return await getPatientHealthMetrics(loincCode, patientID);
    },
    async "patient.getRecordByIdentifier"(patientIdentifier){
        this.unblock();
        return await getPatientRecordByIdentifier(patientIdentifier);
    },
    async "patient.getWeightMetrics"(patientID){
        this.unblock();
        return await getPatientWeightMetrics(patientID);
    },
    async "patient.getHeightMetrics"(patientID) {
        this.unblock();
        return await getPatientHeightMetrics(patientID);
    },
    async "patient.getHeartRateMetrics"(patientID){
        this.unblock();
        return await getPatientHeartRateMetrics(patientID);
    },
    async "patient.getBMIMetrics"(patientID){
        this.unblock();
        return await getPatientBMIMetrics(patientID);
    },
    async "patient.getSystolicBloodPressureMetrics"(patientID){
        this.unblock();
        return await getPatientSystolicBloodPressureMetrics(patientID);
    },
    async "patient.getDiastolicBloodPressureMetrics"(patientID){
        this.unblock();
        return await getPatientDiastolicBloodPressureMetrics(patientID);
    },
    async "patient.getBodyTempMetrics"(patientID){
        this.unblock();
        return await getPatientBodyTempMetrics(patientID);
    },
})