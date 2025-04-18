import { Roles } from 'meteor/alanning:roles';
import { UserRoles } from "../../api/User/userRoles.js";
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(async () => {

    async function createAdmin(options={}){
        const {username, password} = options;
        try{
            const userID = await Accounts.createUserAsync({
                username,
                password,
                role: UserRoles.ADMIN
            });
            await Roles.addUsersToRolesAsync(userID, UserRoles.ADMIN);
        } catch (err) {
            console.log(err);
        }
        
    }

    async function createPatient(options={}){
        const {email, password, firstName, lastName, dob, phoneNumber} = options;
        await Meteor.callAsync("user.signup", {
            email, 
            password, 
            firstName, 
            lastName, 
            dob, 
            phoneNumber, 
            role: UserRoles.PATIENT
        })
    }
    
    for (let role in UserRoles) {
        await Roles.createRoleAsync(UserRoles[role], {unlessExists: true})
    }

    try {
        //root admin
        await createAdmin({ 
            username: "ROOT",
            password: "LIGMA"
        });

        //patient accounts
        await createPatient({
            email: "test1@test.com",
            password: "dummypatient01",
            firstName: "Reggie481",
            lastName: "Romaguera67",
            dob: "2003-03-01",
            phoneNumber: "555-657-6555",
        });

        await createPatient({
            email: "test2@test.com",
            password: "dummypatient02",
            firstName: "Herman763",
            lastName: "Schneider199",
            dob: "1990-07-28",
            phoneNumber: "555-949-2060",
        });

        await createPatient({
            email: "test3@test.com",
            password: "dummypatient03",
            firstName: "Sean831",
            lastName: "Luettgen772",
            dob: "1988-02-28",
            phoneNumber: "555-639-3016",
        })

        



    } catch (error) {

    }

});

// use Meteor.subscribe('userRoles') to access
Meteor.publish('userRoles', function () {
    if (this.userId) {
        return Meteor.roleAssignment.find({ 'user._id': this.userId });
    } else {
        this.ready();
    }
});
