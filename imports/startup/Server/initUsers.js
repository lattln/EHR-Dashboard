import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Roles } from 'meteor/alanning:roles';
import { UserRoles } from "../../api/User/userRoles";


//for development purposes, create initial admin account and clinician accounts here.



Meteor.startup(() =>{

   /* createAdmin({
        username: "ROOT",
        password: "LIGMA"
    }).catch((err) => console.log(err));
   
    createClinician({
        email: "johnD@gmail.com", 
        password: "super-secure-password",
        firstName: "John",
        lastName: "Darksouls",
    }).catch((err) => console.log(err));
    */
});