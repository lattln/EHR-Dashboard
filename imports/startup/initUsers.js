import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Roles } from 'meteor/alanning:roles';
import { UserRoles } from "../api/User/userRoles";


//for development purposes, create initial admin account and clinician accounts here.

const createAdmin = async function({username, password}) {
    try {
        const rootUID = await Accounts.createUserAsync(
            {
                username,
                password,
                role: UserRoles.ADMIN
            }
        );
        await Roles.addUsersToRolesAsync(rootUID, [UserRoles.ADMIN]);
    }
    catch (error) {
        throw error;
    }
};

const createClinician = async function({email, password, firstName, lastName}) {

    try {
        const clinicianUID = await Meteor.callAsync("user.signup", {
            email, 
            password, 
            firstName, 
            lastName, 
            role: UserRoles.CLINICIAN
        });
    } 
    catch (error) {
        throw error;
    }
    

}

Meteor.startup(() =>{

    createAdmin({
        username: "ROOT",
        password: "LIGMA"
    }).catch((err) => console.log(err));
   
    createClinician({
        email: "johnD@gmail.com", 
        password: "super-secure-password",
        firstName: "John",
        lastName: "Darksouls",
    }).catch((err) => console.log(err));
});