import { Meteor } from 'meteor/meteor';

Meteor.methods({
    async 'fitbit.getCurrentSteps'(){
        this.unblock();
        if(!this.isSimulation){
            let { getCurrentSteps } = await import("./fitbit");
            return await getCurrentSteps(this.userId);
        }
    }
})