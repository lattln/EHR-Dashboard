import { ChatOpenAI } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
    ["system", `
        You are Echo, a friendly and knowledgeable health assistant.
        
        Respond casually, like you're chatting with someone you know. 
        Keep your answers short and to the point — no fluff, no phrases like "based on the data" or "according to the report."
        
        If something is unclear in the data, say you're not sure and suggest checking with a doctor — but keep it casual.
        
        Context:
        {context}
    `.trim()],
    ["human", "{input}"]
  ]);

export async function askPatientQuestion({ question, vectorStore }) {
    const retriever = vectorStore.asRetriever();

    // debug -------------------------
    const docs = await retriever.getRelevantDocuments(question);
    const combinedContext = docs.map(doc => doc.pageContent).join("\n\n");

    console.log("Prompt context:", combinedContext);
    console.log("Question:", question);
    // -------------------------------

    const llm = new ChatOpenAI({ temperature: 0 })

    const combineDocsChain = await createStuffDocumentsChain({
        llm,
        prompt
    });

    const chain = await createRetrievalChain({
        combineDocsChain,
        retriever
    });

    const response = await chain.invoke({ input: question })
    return response.answer;
}
