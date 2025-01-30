import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Roles } from 'meteor/roles';
import { roles } from "../api/User/userRoles";


//for development purposes, create initial admin account and clinician accounts here.

const createAdmin = async function({username, password}) {
    const rootUID = await Accounts.createUserAsync(
        {
            username,
            password
        }
    );
    await Roles.addUsersToRolesAsync(rootUID, roles.ADMIN);
};

Meteor.startup(async () =>{
    await createAdmin({username: "ROOT", password: "LIGMA"});


});