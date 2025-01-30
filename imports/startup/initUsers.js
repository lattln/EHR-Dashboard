import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Roles } from 'meteor/roles';
import { roles } from "../api/User/userRoles";


//for development purposes, create initial admin account and clinician accounts here.

const createAdmin = async function({username, password}) {
    try {
        const rootUID = await Accounts.createUserAsync(
            {
                username,
                password
            }
        );
        await Roles.addUsersToRolesAsync(rootUID, roles.ADMIN);
    }
    catch (error) {
        console.log(error.message);
    }
};

const createClinician = async function({email, password, firstName, lastName}) {
    try {
        const clinicianUID = await Meteor.callAsync("user.signup", {
            email, 
            password, 
            firstName, 
            lastName, 
            role: roles.CLINICIAN
        });
    } 
    catch (error) {
        console.log(error.message)
    }
    

}

Meteor.startup(async () =>{

    await createAdmin({username: "ROOT", password: "LIGMA"});
    await createClinician(
        {
            email: "johnD@gmail.com", 
            password:"super-secure-password",
            firstName: "John",
            lastName: "Darksouls"
        });
});