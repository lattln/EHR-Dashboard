 import Client from 'fhir-kit-client';
 import {Meteor} from "meteor/meteor";
 import { logger } from '../../Logging/Server/logger-config.js';

/**
 * object for accessing the specified fhir server.
 * provides a variety of methods to interact with the server, provided the 
 * server supports the actions.
 */

const baseUrl = process.env.FHIR_SERVER_URL || Meteor.settings.private.FHIR_SERVER_URL


export const fhirClient = new Client({
    baseUrl: baseUrl === undefined ? "http://localhost:8080/fhir" : baseUrl
});

logger.info(`Connected to FHIR Server ${baseUrl}.`)
