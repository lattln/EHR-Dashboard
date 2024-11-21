import { Meteor } from 'meteor/meteor';
import dotenv from 'dotenv';
import '../imports/api/methods.js'

dotenv.config();

console.log(process.env.MONGO_URL)

Meteor.startup(() => {
    console.log(`Connected to MongoDB at ${process.env.MONGO_URL}`);
});