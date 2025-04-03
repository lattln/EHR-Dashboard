import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pinecone } from '../Pinecone/pinecone-client.js';
import { generateAllPatientChunks } from "./generatePatientChunks.js";

export async function embedPatientData(patientId) {
    const chunks = await generateAllPatientChunks(patientId);

    await PineconeStore.fromTexts(
        chunks.map(chunk => chunk.text),
        chunks.map(chunk => chunk.metadata),
        new OpenAIEmbeddings(),
        { pineconeIndex: pinecone.index("ehr-index") }
    );
    logger.info("Completed uploading chunks to Pinecone.");
}