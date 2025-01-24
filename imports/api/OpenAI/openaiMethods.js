import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const Response = z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    recommended: z.number().optional()
});

const generatePrompt = (metric, userData) => {
    return `Based on the health guidelines, what is the recommended ${metric} range for a ${userData.age}-year-old ${userData.gender} weighing ${userData.weight} at ${userData.height} inches?`;
}

/**
 * Function to generate prompt for health metric recommendations
 * @param {string} metric - The health metric to be fetched (e.g., "BMI", "heart rate")
 * @param {object} userData - Contains user's relevant data (age, weight, gender)
 * @returns {string} - Prompt for OpenAI API
 */
Meteor.methods({
    async 'openai.send'(metric, userData) {
        check(metric, String);

        const prompt = generatePrompt(metric, userData);

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a health assistant providing recommended health values.' },
                    { role: 'user', content: prompt }
                ],
                response_format: zodResponseFormat(Response, 'response')
            });

            console.log(metric);
            console.log(response.choices[0].message.content);

            const textResponse = response.choices[0].message.content.trim();
            let parsedData;

            try {
                parsedData = JSON.parse(textResponse);
            } catch (parseError) {
                throw new Meteor.Error('parse-error', 'Failed to parse OpenAI response');
            }

            if (parsedData.min !== undefined && parsedData.max !== undefined) {
                return {
                    status: 'success',
                    data: parsedData
                };
            } else if (parsedData.recommended !== undefined) {
                return {
                    status: 'success',
                    data: parsedData
                };
            } else {
                throw new Meteor.Error('invalid-data', 'Response does not contain expected values.');
            }
        } catch (error) {
            throw new Meteor.Error('openai-error', error.message);
        }
    }
});