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
    
    for (let role in UserRoles) {
        await Roles.createRoleAsync(UserRoles[role], {unlessExists: true})
    }

    for (let perm in Permissions)

    await createAdmin({
        username: "ROOT",
        password: "LIGMA"
    });


});

// use Meteor.subscribe('userRoles') to access
Meteor.publish('userRoles', function () {
    if (this.userId) {
        return Meteor.roleAssignment.find({ 'user._id': this.userId });
    } else {
        this.ready();
    }
});
