import { Roles } from 'meteor/alanning:roles';
import { UserRoles } from "../api/User/userRoles.js";

Meteor.startup(async () => {
   
    for (let role in UserRoles) {
        await Roles.createRoleAsync(UserRoles[role], {unlessExists: true})
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
