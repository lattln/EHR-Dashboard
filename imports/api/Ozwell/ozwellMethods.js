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

    async 'ozwell.getSummary'(patientID) {
        const metrics = await Meteor.callAsync('patient.getSummaryMetrics', patientID);

        const latestValue = (metrics) => {
            if (!metrics || metrics.length === 0) return null;
            const latest = metrics[0];
            if (latest.valueQuantities && latest.valueQuantities[0].value) {
                const val = parseFloat(latest.valueQuantities[0].value);
                return parseFloat(val.toFixed(3));
            }
            return null;
        };

        const payload = {
            age: 40, // could be dynamic later
            gender: 'male', // could be dynamic later
            weight: latestValue(metrics.weightMetrics),
            height: latestValue(metrics.heightMetrics),
            bloodPressure: {
                systolic: latestValue(metrics.systolicMetrics),
                diastolic: latestValue(metrics.diastolicMetrics),
            },
            heartRate: latestValue(metrics.heartRateMetrics),
            BMI: latestValue(metrics.BMIMetrics),
            labResults: {
                bodyTemp: latestValue(metrics.bodyTempMetrics),
                oxygenSaturation: latestValue(metrics.oxygenSaturationMetrics),
                hemoglobin: latestValue(metrics.hemoglobinMetrics),
                hemoglobinA1C: latestValue(metrics.hemoglobinA1CMetrics),
                ESR: latestValue(metrics.ESRMetrics),
                glucose: latestValue(metrics.glucoseMetrics),
                potassium: latestValue(metrics.potassiumMetrics),
                cholesterolTotal: latestValue(metrics.cholesterolTotalMetrics),
                LDL: latestValue(metrics.LDLMetrics),
                HDL: latestValue(metrics.HDLMetrics),
                BUN: latestValue(metrics.BUNMetrics),
                creatinine: latestValue(metrics.creatinineMetrics),
            },
        };

        // building the prompt; each field is using the medical abbreviation to minimiaze the amount of tokens used per-call
        const prompt =
            `2-4 sentences, speak directly to the patient using "you" and "your" and offer brief advice. Be optimistic. 
            Wrap important values in <strong> tags.` +
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