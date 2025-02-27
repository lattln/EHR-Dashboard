import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { callOpenAI } from '../OpenAI/openaiMethods.js';

async function callOzwell(prompt, schema) {
    try {
        const url = 'https://ai.bluehive.com/api/v1/completion';
        const token = process.env.OZWELL_SECRET_KEY;

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
async function fallbackCall(prompt, schema) {
    try {
        return await callOzwell(prompt, schema);
    } catch (ozwellError) {
        console.error("Ozwell failed, falling back to OpenAI:", ozwellError);
        return await callOpenAI(prompt, schema);
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

        const parsedData = await fallbackCall(prompt, schema);
        
        if (parsedData.min !== undefined && parsedData.max !== undefined) {
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

        const parsedData = await fallbackCall(prompt, schema);

        if (parsedData.recommended !== undefined) {
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

    async 'ozwell.getSummary'(payload) {
        // payload validation; each value can be optional in the event one of the calls failed
        check(payload, {
            age: Number,
            gender: String,
            weight: Number,
            height: Number,
            bloodPressure: {
                systolic: Match.OneOf(Number, null),
                diastolic: Match.OneOf(Number, null),
            },
            heartRate: Match.OneOf(Number, null),
            BMI: Match.OneOf(Number, null),
            labResults: {
                bodyTemp: Match.OneOf(Number, null),
                oxygenSaturation: Match.OneOf(Number, null),
                hemoglobin: Match.OneOf(Number, null),
                hemoglobinA1C: Match.OneOf(Number, null),
                ESR: Match.OneOf(Number, null),
                glucose: Match.OneOf(Number, null),
                potassium: Match.OneOf(Number, null),
                cholesterolTotal: Match.OneOf(Number, null),
                LDL: Match.OneOf(Number, null),
                HDL: Match.OneOf(Number, null),
                BUN: Match.OneOf(Number, null),
                creatinine: Match.OneOf(Number, null),
            }
          });

        // building the prompt; each field is using the medical abbreviation to minimiaze the amount of tokens used per-call
        const prompt =
            `2-4 sentences, speak directly to the patient using "you" and "your" and offer brief advice. Be optimistic. ` +
            `Data: A:${payload.age} G:${payload.gender} W:${payload.weight}kg H:${payload.height}cm BP:${payload.bloodPressure.systolic}/${payload.bloodPressure.diastolic}` +
            (payload.heartRate ? ` HR:${payload.heartRate}` : '') +
            (payload.BMI ? ` BMI:${payload.BMI}` : '') +
            (payload.labResults
                ? ` L:${[
                    payload.labResults.bodyTemp && `T${payload.labResults.bodyTemp}`,
                    payload.labResults.oxygenSaturation && `O${payload.labResults.oxygenSaturation}`,
                    payload.labResults.hemoglobin && `HGB${payload.labResults.hemoglobin}`,
                    payload.labResults.hemoglobinA1C && `A1C${payload.labResults.hemoglobinA1C}`,
                    payload.labResults.ESR && `ESR${payload.labResults.ESR}`,
                    payload.labResults.glucose && `Glu${payload.labResults.glucose}`,
                    payload.labResults.potassium && `K${payload.labResults.potassium}`,
                    payload.labResults.cholesterolTotal && `Chol${payload.labResults.cholesterolTotal}`,
                    payload.labResults.LDL && `LDL${payload.labResults.LDL}`,
                    payload.labResults.HDL && `HDL${payload.labResults.HDL}`,
                    payload.labResults.BUN && `BUN${payload.labResults.BUN}`,
                    payload.labResults.creatinine && `Cr${payload.labResults.creatinine}`,
                ]
                    .filter(Boolean)
                    .join(',')}`
                : '') +
            ` S:`;

        const schema = {
            'summary': {
                'type': 'string'
            }
        }

        const parsedData = await fallbackCall(prompt, schema);

        if (parsedData.summary !== undefined) {
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