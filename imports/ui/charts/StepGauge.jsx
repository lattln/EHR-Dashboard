import GaugeComponent from "react-gauge-component";
import React, { useEffect, useState } from "react";
import { getStepGoal, getCurrentSteps } from "../../api/FitBit/fitbit";

function StepGauge({}){
    const [steps, setSteps] = useState(0);
    const [goalSteps, setGoalSteps ] = useState(10000);
    const [fitBitLinked, setFitBitLinked] = useState(false);

    useEffect(() => {
        async function currSteps(){
            let s = await getCurrentSteps();
            console.log(s);
            setSteps(s.steps);
            setGoalSteps(s.goal);
        }

        if(localStorage.getItem('fitbit-token') != null){
            setFitBitLinked(true);
            currSteps();
        }
    }, []);

    return (
        <div>
            {fitBitLinked ?
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
                : 'Link your FitBit account to access this widget.'
            }
        </div>
    )
}

export default StepGauge;