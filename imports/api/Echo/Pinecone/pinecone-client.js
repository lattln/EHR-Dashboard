import { Meteor } from 'meteor/meteor';
import { Pinecone } from "@pinecone-database/pinecone";

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || Meteor.settings.private.PINECONE_API_KEY
})