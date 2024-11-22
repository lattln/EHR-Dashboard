import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.startup(() => {
    Roles.createRoleAsync('clinician', { unlessExists: true});
    Roles.createRoleAsync('patient', { unlessExists: true});
});

Meteor.publish('userRoles', function () {
    if (this.userId) {
        return Meteor.roleAssignment.find({ 'user._id': this.userId });
    } else {
        this.ready();
    }
});
