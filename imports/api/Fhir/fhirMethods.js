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

Meteor.methods({
    async "patient.getHealthMetrics"(loincCode, patientID) {
        this.unblock();
        return await getPatientHealthMetrics(loincCode, patientID);
    },
    async "patient.getRecordByIdentifier"(patientIdentifier) {
        this.unblock();
        return await getPatientRecordByIdentifier(patientIdentifier);
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
    async "patient.getSummaryMetrics"(patientID) {
        this.unblock();

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
            getPatientHealthMetrics(LOINC_MAPPING.BODY_WEIGHT, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.BODY_HEIGHT, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE_SYSTOLIC, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.BODY_BLOOD_PRESSURE_DIASTOLIC, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.BODY_HEART_RATE, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.BODY_BMI, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.BODY_TEMP, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.BODY_OXYGEN_SATURATION, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_HGB, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.HEMOGLOBIN_A1C, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.ERYTHROCYTE_SEDIMENTATION_RT, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.GLUCOSE_SERUM_PLASMA, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.POTASSIUM_SERUM_PLASMA, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.CHOLESTEROL_TOTAL, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.LOW_DENS_LIPOPROTEIN, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.HIGH_DENS_LIPOPROTEIN, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.UREA_NITROGEN_BUN, patientID),
            getPatientHealthMetrics(LOINC_MAPPING.CREATININE, patientID)
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
    }
});