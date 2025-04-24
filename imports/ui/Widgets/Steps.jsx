import GaugeComponent from "react-gauge-component";
import React, { useEffect, useState } from "react";
import { useUser } from "../User";

function Steps({ fitBitLinked }){
    const [steps, setSteps] = useState(0);
    const [goalSteps, setGoalSteps] = useState(10000);
    const [dist, setDist] = useState(0);
    const { userLoading, id } = useUser();

    useEffect(() => {
        async function currSteps(){
            let s = await Meteor.callAsync('fitbit.getCurrentSteps', id);
            console.log(s);
            setSteps(s.steps);
            setGoalSteps(s.goal);
            setDist(s.distance);
        }

        if(fitBitLinked && !userLoading){
            currSteps();
        }
    }, [fitBitLinked, userLoading]);

    return (
        <>
            {fitBitLinked ?
                <>
                    <GaugeComponent
                        minValue={0}
                        maxValue={goalSteps}
                        value={steps}
                        type='radial'
                        arc={{
                            nbSubArcs: 100,
                            colorArray: ['#EA4228', '#F5CD19', '#5BE12C'],
                            gradient: true
                        }}
                        labels={{
                            valueLabel: {
                                style: {
                                    fill: 'black',
                                    textShadow: 'none'
                                }
                            }
                        }}
                    />
                    <h3>{dist} Mi.</h3>
                </>
                : 'Link your FitBit account to access this widget.'
            }
        </>
    )
};

export default Steps;