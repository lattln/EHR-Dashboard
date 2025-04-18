import { Meteor } from "meteor/meteor";
import { validate, SchemaBuilder} from "./../Validator/validator.js"
import { TypeCheck } from "../Validator/typechecking.js";


Meteor.methods({
    async 'admin.addRolesToUsers'(userIDList, rolesList){
        this.unblock();
        const functionSchema = SchemaBuilder()
                                .addParam("userIDList", "array", 
                                    {
                                        itemType: "string"
                                    })
                                .addParam("rolesList", "array", 
                                    {
                                        itemType: "string"
                                    })
                                .build({userIDList, rolesList});
        
        if(!validate(functionSchema))
            throw new Meteor.Error("Invalid-Arguments", "missing required arguments userList and rolesList");
        if (!this.isSimulation){
            const {isAdmin} = await import('./Server/UserUtils.js');
            const {addUsersToRoles} = await import("./Server/AdminUtils.js");

            if(!this.userId || !(await isAdmin(this.userId))){
                throw new Meteor.Error("Not-Authorized", "Admin only method");
            }

            try{
                await addUsersToRoles(this.userId, userIDList, rolesList);
            } catch (error) {
                if(error instanceof Meteor.Error){
                    throw error;
                } else {
                    throw new Meteor.Error("Internal-Server-Error", error.message);
                }
            }

        }
    },

    async 'admin.removeRolesFromUsers'(userIDList, rolesList){
        this.unblock();
        const functionSchema = SchemaBuilder()
                                .addParam("userIDList", "array", 
                                    {
                                        itemType: "string"
                                    })
                                .addParam("rolesList", "array", 
                                    {
                                        itemType: "string"
                                    })
                                .build({userIDList, rolesList});
        
        if(!validate(functionSchema))
            throw new Meteor.Error("Invalid-Arguments", "missing required arguments userList and rolesList");

        if (!this.isSimulation){
            const {isAdmin} = await import('./Server/UserUtils.js');
            const {removeUsersFromRoles} = await import("./Server/AdminUtils.js")

            if(!this.userId || !(await isAdmin(this.userId))){
                throw new Meteor.Error("Not-Authorized", "Admin only method");
            }

            try{
                await removeUsersFromRoles(this.userId, userIDList, rolesList);
            } catch (error) {
                if(error instanceof Meteor.Error){
                    throw error;
                } else {
                    throw new Meteor.Error("Internal-Server-Error", error.message);
                }
            }
        }

    },

    async 'admin.createClinicianUser'(clinicianUserInfo = {}){
        this.unblock();
        const clinicianUserSchema = SchemaBuilder()
                                        .addParam("email", "string")
                                        .addParam("password", "string")
                                        .addParam('role', "string")
                                        .addParam("firstName", "string")
                                        .addParam("lastName", "string")
                                        .addParam("profile", "object", {
                                            required: false,
                                            ignoreValidation: true
                                        })
                                        .build(clinicianUserInfo);

        try {
            validate(clinicianUserSchema);
        } catch (error) {
            throw new Meteor.Error("Invalid-Arguments", error.message);
        }

        if (!this.isSimulation){
            const {isAdmin, signupUser} = await import('./Server/UserUtils.js');
            const {logger} = await import("./../Logging/Server/logger-config.js");

            if(!this.userId || !(await isAdmin(this.userId))){
                throw new Meteor.Error("Not-Authorized", "Admin only method");
            }

            try{
                const newUserID = await signupUser(clinicianUserInfo);
                logger.info(`admin: ${this.userId} created a new clinician user: ${newUserID}`);
                return newUserID;
            } catch (error) {
                logger.error(error, `admin initiated clinician user creation failed.`);
                if(error instanceof Meteor.Error){
                    throw error;
                } else {
                    throw new Meteor.Error("Internal-Server-Error", error.message);
                }
            }
        }

    },

    async 'admin.createPatientUser'(patientUserInformation = {}){
        this.unblock();
        const patientUserSchema = SchemaBuilder()
                                        .addParam("email", "string")
                                        .addParam("password", "string")
                                        .addParam('role', "string")
                                        .addParam("firstName", "string")
                                        .addParam("lastName", "string")
                                        .addParam("phoneNumber", "string")
                                        .addParam("dob", "string")
                                        .addParam("profile", "object", {
                                            required: false,
                                            ignoreValidation: true
                                        })
                                        .build(patientUserInformation);

        try {
            validate(patientUserSchema);
        } catch (error) {
            throw new Meteor.Error("Invalid-Arguments", error.message);
        }
        if (!this.isSimulation){
            const {isAdmin, signupUser} = await import('./Server/UserUtils.js');
            const {logger} = await import("./../Logging/Server/logger-config.js");

            if(!this.userId || !(await isAdmin(this.userId))){
                throw new Meteor.Error("Not-Authorized", "Admin only method");
            }

            try {
                const newUserID = await signupUser(patientUserInformation);
                logger.info(`admin: ${this.userId} created a new patient user: ${newUserID}`);
                return newUserID;

            } catch (error){
                logger.error(error, `admin initiated patient user creation failed.`);
                if(error instanceof Meteor.Error){
                    throw error;
                } else {
                    throw new Meteor.Error("Internal-Server-Error", error.message);
                }
            }
        }
    },

    async 'admin.removeUserAccount'(userID){
        this.unblock();
        if(TypeCheck.isUndefined(userID) || !TypeCheck.isString(userID))
            throw new Meteor.Error("Invalid-Arguments", error.message);

        if (!this.isSimulation){
            const {isAdmin} = await import('./Server/UserUtils.js');
            const {removeUser} = await import('./Server/AdminUtils.js');

            if (!(await isAdmin(this.userId)))
                throw new Meteor.Error("Not-Authorized", "admin only method");

            try {
                await removeUser(this.userId, userID);

            } catch (error) {
                throw new Meteor.Error("Internal-Server-Error", error.message);
            }


        }
    },
});