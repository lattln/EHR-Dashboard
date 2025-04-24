import { Meteor } from 'meteor/meteor';

Meteor.methods({
    async 'fitbit.getCurrentSteps'(){
        this.unblock();
        if(!this.isSimulation){
            let { getCurrentSteps } = await import("./fitbit");
            return await getCurrentSteps(this.userId);
        }
    },
    async 'fitbit.getSleepBreakdown'(){
        this.unblock();
        if(!this.isSimulation){
            let { getSleepBreakdown } = await import("./fitbit");
            return await getSleepBreakdown(this.userId);
        }
    },
    async 'fitbit.getSleepDuration'(){
        this.unblock();
        if(!this.isSimulation){
            let { getSleepDuration } = await import("./fitbit");
            return await getSleepDuration(this.userId);
        }
    },
    async 'fitbit.getSleepEfficiency'(){
        this.unblock();
        if(!this.isSimulation){
            let { getSleepEfficiency } = await import("./fitbit");
            return await getSleepEfficiency(this.userId);
        }
    },
    async 'fitbit.getSleepHeatMap'(){
        this.unblock();
        if(!this.isSimulation){
            let { getSleepHeatMap } = await import("./fitbit");
            return await getSleepHeatMap(this.userId);
        }
    }
})