 import Client from 'fhir-kit-client';
 import {Meteor} from "meteor/meteor";

/**
 * object for accessing the specified fhir server.
 * provides a variety of methods to interact with the server, provided the 
 * server supports the actions.
 */
export const fhirClient = new Client({
    baseUrl: process.env.FHIR_SERVER_URL !== undefined ? process.env.FHIR_SERVER_URL : "http://localhost:8080/fhir"
});
