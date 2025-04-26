import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { callOpenAI } from '../OpenAI/openaiMethods.js';
import { z } from 'zod';
import { countTokens } from '../OpenAI/tokenCounter.js';
import { logger } from '../Logging/Server/logger-config.js';
import { P } from 'pino';
import { getFhirIDFromUserAccount } from '../User/Server/UserUtils.js';

async function callOzwell(prompt, schema) {
    try {
        const url = 'https://ai.bluehive.com/api/v1/completion';
        const token = process.env.OZWELL_SECRET_KEY || Meteor.settings.private.OZWELL_SECRET_KEY;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                prompt,
                systemMessage: 'You are a health assistant providing the patient with healthcare assistance.',
                response_format: {
                    'type': 'json_schema',
                    'json_schema': {
                        'name': 'response',
                        'schema': {
                            'type': 'object',
                            'properties': schema
                        }
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Meteor.Error('ozwell-call-failed', `API call failed with status: ${response.status}`)
        }

        const data = await response.json();

        const textResponse = data.choices?.[0]?.message?.content?.trim();
        if (!textResponse) {
            throw new Meteor.Error('ozwell-api-no-response', 'No text response received from Ozwell.')
        }

        let parsedData;
        try {
            parsedData = JSON.parse(textResponse);
        } catch (parseError) {
            throw new Meteor.Error('parse-error', 'Failed to parse Ozwell response');
        }

        return parsedData;
    } catch (error) {
        throw new Meteor.Error('ozwell-api-error', error.message);
    }
}

/** Hopefully serves as a temporary wrapper for calling our AI tools.
 *  In the event that Ozwell has an error, it will fallback onto
 *  OpenAI.
 * 
 * @param {*} prompt 
 * @param {*} schema 
 * @returns 
 */
async function fallbackCall(prompt, schema, fallbackSchema) {
    try {
        return await callOzwell(prompt, schema);
    } catch (ozwellError) {
        console.error("Ozwell failed, falling back to OpenAI:", ozwellError);
        return await callOpenAI(prompt, fallbackSchema);
    }
}

Meteor.methods({
    async 'ozwell.getMinMax'(metric, userData) {
        check(metric, String);
        check(userData, {
            age: Number,
            gender: String,
            weight: Number,
            height: Number,
        });

        const prompt = `
            Give me a very generous ${metric} range for a ${userData.age} year-old ${userData.gender} weighing ${userData.weight} kg at ${userData.height} cm.`;
        const schema = {
            'min': {
                'type': 'number'
            },
            'max': {
                'type': 'number'
            }
        }
        const fallbackSchema = z.object({
            min: z.number().optional(),
            max: z.number().optional()
        });

        const parsedData = await fallbackCall(prompt, schema, fallbackSchema);

        if (parsedData.min !== undefined && parsedData.max !== undefined) {
            logger.info(`ozwell.getMinMax called using: ${countTokens(prompt)} tokens`);
            return {
                status: 'success',
                data: {
                    min: parsedData.min,
                    max: parsedData.max
                },
            };
        } else {
            throw new Meteor.Error('invalid-data', 'Response does not contain min and max values.');
        }
    },

    async 'ozwell.getRecommended'(metric, userData) {
        check(metric, String);
        check(userData, {
            age: Number,
            gender: String,
        });

        const prompt = `
            Give me a recommended ${metric} for a ${userData.age} year-old ${userData.gender} patient.`;
        const schema = {
            'recommended': {
                'type': 'number'
            },
        }
        const fallbackSchema = z.object({
            recommended: z.number()
        })

        const parsedData = await fallbackCall(prompt, schema, fallbackSchema);

        if (parsedData.recommended !== undefined) {
            logger.info(`ozwell.getRecommended called using: ${countTokens(prompt)} tokens`);
            return {
                status: 'success',
                data: {
                    recommended: parsedData.recommended
                },
            };
        } else {
            throw new Meteor.Error('indalid-data', 'Response does not contain a recommended value.')
        }
    },

    async 'ozwell.getSummary'(patientID, meteorCall) {
        // const temp = await getFhirIDFromUserAccount(this.userId)
        // console.log("SDKLJFHSDJKHFKJSDHFKJSDHFJKSDHJKFHSDJKFHJSDKFH", temp)

        const prompt = await Meteor.callAsync(meteorCall, patientID);

        const schema = {
            'summary': {
                'type': 'string'
            }
        }
        const fallbackSchema = z.object({
            summary: z.string()
        });

        const parsedData = await fallbackCall(prompt, schema, fallbackSchema);

        if (parsedData.summary !== undefined) {
            logger.info(`ozwell.getSummary called using: ${countTokens(prompt)} tokens`);
            return {
                status: 'success',
                data: {
                    summary: parsedData.summary
                }
            };
        } else {
            throw new Meteor.Error('invalid-data', 'Response does not contain a summary.')
        }
    }
})