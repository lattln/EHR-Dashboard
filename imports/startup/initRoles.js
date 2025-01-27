import { Roles } from 'meteor/alanning:roles';
import { roles } from "../api/User/userRoles.js";

Meteor.startup(() => {
    roles.forEach(role => {
        Roles.createRoleAsync(role, { unlessExists: true });
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