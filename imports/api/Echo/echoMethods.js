import { Meteor } from 'meteor/meteor';
import { embedPatientData } from "./Utils/embedPatientData.js";
import { logger } from '../Logging/Server/logger-config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { pinecone } from './Pinecone/pinecone-client.js';
import { PineconeStore } from "@langchain/pinecone";
import { askPatientQuestion } from './Utils/askPatientQuestion.js';

Meteor.methods({
    async "echo.embedPatientData"(patientId) {
        this.unblock();
        //if (!this.userId) throw new Meteor.Error("unauthorized");

        try {
            await embedPatientData(patientId);
            logger.info("Patient data embedded successfully.");
        } catch (error) {
            throw new Meteor.Error("embedding-failed", error.message);
        }
    },
    async "echo.ask"(patientId, question) {
        this.unblock();
        //if (!this.userId) throw new Meteor.Error("unauthorized");

        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({
                apiKey: process.env.OPENAI_API_KEY || Meteor.settings.private.OPENAI_API_KEY
            }),
            {
                pineconeIndex: pinecone.index("ehr-index"),
                filter: { patientId }
            }
        );

        const response = await askPatientQuestion({ question, vectorStore });
        return response;
    }
});