import GaugeComponent from "react-gauge-component";
import React, { useEffect, useState } from "react";

function BMI({ min=16, max=40 }){
    const [value, setVal] = useState(25);
    const [steps, setSteps] = useState([
        { color: '#FFA500', limit: 17, showTick: true },
        { color: '#FFFF00', limit: 18.5, showTick: true },
        { color: '#00FF00', limit: 25, showTick: true },
        { color: '#FFFF00', limit: 30, showTick: true },
        { color: '#FFA500', limit: 35, showTick: true },
        { color: '#FF0000', limit: 40, showTick: true }
    ]);

    useEffect(() => {
        async function getBMI(){
            let res = await Meteor.callAsync('patient.getBMIMetrics', 1);
            setVal(res[res.length - 1].valueQuantities[0].value);
        }

        getBMI();
    }, []);

    return (
        <>
			<h2 className="text-lg font-bold">Body Mass Index</h2>
            {value ?
                <GaugeComponent
                    minValue={min}
                    maxValue={max}
                    value={value}
                    gradient={true}
                    type='radial'
                    arc={{
                        nbSubArcs: steps.length,
                        subArcs: steps 
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
                : 'BMI data not found'
            }
        </>
    )
}

export default BMI;