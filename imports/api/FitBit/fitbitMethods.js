import { Meteor } from 'meteor/meteor';

Meteor.methods({
    async 'fitbit.getCurrentSteps'(){
        this.unblock();
        if(!this.isSimulation){
            let { getCurrentSteps } = await import("./fitbit");
            let res = await getCurrentSteps(this.userId);

            return res;
        }
    }
})