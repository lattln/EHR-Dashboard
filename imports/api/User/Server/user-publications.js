import { Meteor } from "meteor/meteor";
import { isAdmin } from "./UserUtils.js";
import { logger } from "../../Logging/Server/logger-config.js";


//set the document property name to 1 if you want it included on the frontend
//make sure that it isn't something that is supposed to be secret.
Meteor.publish("userData", function () {
    try {
        if (this.userId) {
            return Meteor.users.find({ _id: this.userId },
                {
                    fields: {
                        "profile": 1,
                        "fhirID": 1,
                        "patients": 1,
                        "clinicians": 1,
                        "fitbitAccountAuth": 1,
                        "config": 1,
                        "emails.0": 1
                    }
                }
            );
        } else {
          this.ready();
        }
    } catch (error) {
        logger.error(error, "error trying to retrieve user information");
        throw new Meteor.Error("Internal-Server-Error", error.message);
    }
   
});