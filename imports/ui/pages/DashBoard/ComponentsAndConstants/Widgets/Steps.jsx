import GaugeComponent from "react-gauge-component";
import React, { useEffect, useState } from "react";
import { getCurrentSteps } from "../../../../../api/FitBit/fitbit";

function Steps({ fitBitLinked }){
    const [steps, setSteps] = useState(0);
    const [goalSteps, setGoalSteps] = useState(10000);
    const [dist, setDist] = useState(0);

    useEffect(() => {
        async function currSteps(){
            let s = await getCurrentSteps();
            setSteps(s.steps);
            setGoalSteps(s.goal);
            setDist(s.distance);
        }

        if(fitBitLinked){
            currSteps();
        }
    }, [fitBitLinked]);

    return (
        <>
            <h2 className="text-lg font-bold">Steps</h2>
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
            <h3>{dist} Mi.</h3>
        </>
    )
};

export default Steps;