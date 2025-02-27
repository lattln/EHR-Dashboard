import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Calls the OpenAI API with a given prompt.
 *
 * @param {string} prompt - The prompt to send to OpenAI.
 * @param {z.ZodType} schema - The Zod schema used to validate the response.
 * @returns {Promise<Object>} - The parsed data from the OpenAI API response.
 * @throws {Meteor.Error} - Throws an error if parsing or the API call fails.
 */
async function callOpenAI(prompt, schema) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a health assistant providing recommended health values.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        response_format: zodResponseFormat(schema, 'response'),
    });

    const textResponse = response.choices[0].message.content.trim();
    let parsedData;

    try {
        parsedData = JSON.parse(textResponse);
    } catch (parseError) {
        throw new Meteor.Error('parse-error', 'Failed to parse OpenAI response');
    }

    return parsedData;
  } catch (error) {
        throw new Meteor.Error('openai-error', error.message);
  }
}

Meteor.methods({
    /**
     * Meteor method to get a range (min and max values) for a given health metric.
     *
     * @param {string} metric - The health metric that is being requested.
     * @param {Object} userData - The user data containing age, gender, weight, and height.
     * @param {number} userData.age - The age of the user.
     * @param {string} userData.gender - The gender of the user.
     * @param {number} userData.weight - The weight of the user in kg.
     * @param {number} userData.height - The height of the user in cm.
     * @returns {Object} - An object with a status and the data containing min and max values.
     */
    async 'openai.getMinMax'(metric, userData) {
        // validation
        check(metric, String);
        check(userData, {
            age: Number,
            gender: String,
            weight: Number,
            height: Number,
        });

        const prompt = `Give me a very generous ${metric} range for a ${userData.age} year-old ${userData.gender} weighing ${userData.weight} kg at ${userData.height} cm. Accomodate for users who may be up to 5.0 out of the range.`
        const schema = z.object({
            min: z.number().optional(),
            max: z.number().optional()
        });
        
        const parsedData = await callOpenAI(prompt, schema);

        if (parsedData.min !== undefined && parsedData.max !== undefined) {
            return {
                status: 'success',
                data: {
                    min: parsedData.min,
                    max: parsedData.max,
                },
            };
        } else {
            throw new Meteor.Error(
                'invalid-data',
                'Response does not contain both min and max values.'
            );
        }
    },

  /**
   * Meteor method to get a recommended value for a given health metric.
   *
   * @param {string} metric - The health metric that is being requested.
   * @param {Object} userData - The user data containing age and gender.
   * @param {number} userData.age - The age of the user.
   * @param {string} userData.gender - The gender of the user.
   * @returns {Object} - An object with a status and the data containing the recommended value.
   */
    async 'openai.getRecommended'(metric, userData) {
        // validation
        check(metric, String);
        check(userData, {
            age: Number,
            gender: String,
        });

        const prompt = `Give me a recommended ${metric} for a ${userData.age} year-old ${userData.gender} patient.`
        const schema = z.object({
            recommended: z.number()
        })
        const parsedData = await callOpenAI(prompt, schema);

        if (parsedData.recommended !== undefined) {
            return {
                status: 'success',
                data: {
                    recommended: parsedData.recommended,
                },
            };
        } else {
            throw new Meteor.Error(
                'invalid-data',
                'Response does not contain a recommended value.'
            );
        }
    },
});

export { callOpenAI };