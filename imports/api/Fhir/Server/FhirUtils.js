import { fhirClient } from "./fhirclient";
import { logger } from "../../Logging/Server/logger-config";

export function transformObservationInformation(observationResource) 
{
    let valueQuantities;

    if (!observationResource || observationResource.resourceType !== "Observation")
        return null;

    if (observationResource.component && Array.isArray(observationResource.component)) {
        valueQuantities = observationResource.component.map((subObservation) => {
            return {
                loincCode: subObservation.code.coding[0].code,
                loincText: subObservation.code.coding[0].display,
                valueQuantity: subObservation.valueQuantity
            }
        })
    }

    return {
        loincText: observationResource.code.text,
        loincCode: observationResource.code.coding[0].code,
        dateIssued: observationResource.issued,
        valueQuantities: observationResource.valueQuantity ? [observationResource.valueQuantity] : valueQuantities
    }

}

export async function transformDiagonosticReportInformation(diagnosticsReportResource) {
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
        logger.error(error, error.message);
        throw error;
    }
    
}
export function getPatientAge(birthdate) {
    const dateNow = Date.now();
    const patientBirthDateMs = Date.parse(birthdate);

    const ageDate = new Date(dateNow - patientBirthDateMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

//returns the full FHIR patient record of the specified patientID
export async function getPatientRecordByID(patientID) {
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
        logger.error(error, error.message);
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
export async function findPatientByInfo(patientInformation) {

    let matchedPatients = [];

    const {patientGivenName, patientFamilyName, patientPhoneNumber, patientDOB} = patientInformation;

    logger.info(patientInformation, "searching for patient with matching information in fhir server.")

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

        if(!searchResponse || !searchResponse.entry || searchResponse.total === 0) {
            logger.warn("no patient found");
            return -1;
        }
    
        if(searchResponse.total === 1) {
            logger.info(`Patient found with fhirID ${searchResponse.entry[0].resource.id}`);
            return parseInt(searchResponse.entry[0].resource.id);
        }

        for (const patient of searchResponse.entry) {
            matchedPatients.push(parseInt(patient.resource.id));
        }

        if (matchedPatients.length > 1)
            logger.warn("Multiple patients found matching information.")

        return matchedPatients;
    }
    catch (error) {
        logger.error(error.message);
        throw error;
    }
}

export async function getPatientObservation(observationID) {
    let response;
    try {
        response = await fhirClient.read({
            resourceType: "Observation",
            id: observationID
        })
        logger.info(`Getting observation # ${observationID}`)

        return response;
    }
    catch (error) {
        logger.error(error, error.message);
        throw error;
    }
    
}

export async function getPatientHealthMetrics(loincCode, patientID, pageNumber, count) {
    let response;
    let metrics = [];
    let offset = 0;
    
    try {
        logger.info({loincCode, patientID, pageNumber, count}, `Getting Health Metrics for Patient/${patientID}`);

        if (!(loincCode && patientID && pageNumber && count)) {
            logger.warn("Required health metric arguments were not present.");
            return metrics;
        }

        //join loincCodes in a string seperated by "," and retrieve observations with the loinc Codes.
        if (Array.isArray(loincCode)) {
            loincCode = loincCode.join(",");
        }
        

        if (pageNumber <= 0 || count <= 0) {
            logger.warn("Page number and count out of bounds.");
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
        logger.error(error, error.message)
        throw error;
    }
}

/**
 * a function that pulls a given patient's diagnosticsreports from the fhir server and pulls the refrencing observations
 * so that the results can be displayed visually in the recent labs section of the client dashboard
 * @param {*} patientID 
 */
export async function getRecentPatientLabs(patientID, pageNumber, count) {
    let labs = [];
    let offset = (pageNumber - 1) * count;
    try {
        logger.info({patientID: patientID, pageNumber: pageNumber, count: count}, `retrieving patient labs for Patient/${patientID}`)
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
        logger.error(error, error.message)
        throw error;
    }

}