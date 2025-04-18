import { ChatOpenAI } from "@langchain/openai";
import { Mongo } from "meteor/mongo"
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import { MongoDBChatMessageHistory } from "@langchain/mongodb";

const memoriesCollection = new Mongo.Collection("echo-memories")

// const memory = new BufferMemory({
//     memoryKey: "chat_history",
//     returnMessages: true,
//     inputKey: "input",
//     outputKey: "answer"
// })

const prompt = ChatPromptTemplate.fromMessages([
    ["system", `
        You are Echo, a friendly health guide.

    Tone
    Chat like a supportive friend—you/your, upbeat, no jargon.
    Grade-8 reading level or easier.

    What to deliver
    Keep it short, no bullet points (max ~40 tokens).
    Skip fluff and phrases like "based on the data" or "according to the report."
    Use plain words; spell out or quickly define any medical term.
    Show a number only when it's clearly high or low—otherwise say it's “normal” or “in range.”
    Highlight anything that might need follow-up.

    If unsure
    Say you're not sure and gently suggest talking with a doctor.

    Context
    {context}
    `.trim()],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"]
]);

const memories = new Map();
function getMemory(patientId) {
    if (!memories.has(patientId)) {
        const collection = memoriesCollection.rawCollection();
        memories.set(
            patientId,
            new BufferMemory({
                memoryKey: "chat_history",
                returnMessages: true,
                inputKey: "input",
                outputKey: "answer",
                chatHistory: new MongoDBChatMessageHistory({
                    collection,
                    sessionId: String(patientId)
                })
            })
        )
    };
    return memories.get(patientId);
}


// util function to run a chain with memory
async function runWithMemory({
    chain, memory, input, extra={}
}) {
    const { chat_history } = await memory.loadMemoryVariables({});
    const result = await chain.invoke({ input, chat_history, ...extra });
    await memory.saveContext({ input }, { answer: result.answer });
    return result.answer;
}

// ---- main entry ------------------------------------------------------------
/**
 * Ask a health‑related question using RAG + per‑user memory.
 * @param {Object}  opts
 * @param {string}  opts.userId      Unique user/session ID
 * @param {string}  opts.question    The user’s question
 * @param {Object}  opts.vectorStore A LangChain vector store
 */
export async function askPatientQuestion({ question, vectorStore }) {
    const patientId = 1     // TODO: use endpoint to get patient ID
    const memory = getMemory(patientId);
    const retriever = vectorStore.asRetriever();

    // debug -------------------------
    const docs = await retriever.getRelevantDocuments(question);
    const combinedContext = docs.map(doc => doc.pageContent).join("\n\n");

    console.log("Prompt context:", combinedContext);
    console.log("Question:", question);
    // -------------------------------

    // getting the loinc
    const loincCodes = Array.from(
        new Set(
            docs.map((d) => d.metadata.loincCode)
            .filter((code) => typeof code === "string" && code.length > 0)
        )
    )

    const llm = new ChatOpenAI(
        {
            temperature: 0,
            apiKey: process.env.OPENAI_API_KEY || Meteor.settings.private.OPENAI_API_KEY
        })

    const combineDocsChain = await createStuffDocumentsChain({ llm, prompt });
    const chain = await createRetrievalChain({ combineDocsChain, retriever, memory });

    const response = await runWithMemory({ chain, memory, input: question });
    console.log(await memory.loadMemoryVariables({}));
    return { response, loincCodes };
}
