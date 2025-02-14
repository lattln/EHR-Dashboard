 import Client from 'fhir-kit-client';

/**
 * object for accessing the specified fhir server.
 * provides a variety of methods to interact with the server, provided the 
 * server supports the actions.
 */
export const fhirClient = new Client({
    baseUrl: `http://localhost:8080/fhir`
})
