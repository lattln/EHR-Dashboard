import {Meteor} from "meteor/meteor";
import { logger } from "./logger-config.js";
import { logsCollection } from "../logs-collection.js";
import { isAdmin } from "../../User/Server/UserUtils.js";


Meteor.publish("logsList", async function() {
    try {
        if (this.userId && await isAdmin(this.userId)) {
            return logsCollection.find({})
        } else {
            this.ready();
        }
    }
    catch (error) {
        logger.error(error, "Error trying to access the logs collection");
        throw new Meteor.Error("Internal-Server-Error", )
    }
    
})