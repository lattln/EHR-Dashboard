import {Meteor} from "meteor/meteor";
import { isAdmin } from "./UserUtils";

Meteor.publish("createdUsers", async function(){
    try{
        if(this.userId && await isAdmin(this.userId)) {
            return Meteor.users.find({});
        } else {
            this.ready();
        }
    } catch (error) {
        logger.error(error, "error trying to retrieve list of created users from database.");
        throw new Meteor.Error("Internal-Server-Error", error.message);
    }
    
});