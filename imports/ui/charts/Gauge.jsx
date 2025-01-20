import GaugeComponent from "react-gauge-component";
import React, { useEffect, useState } from "react";

function Gauge({ max, min, steps, loinc, className, label }){
    const [value, setVal] = useState(null);

    useEffect(() => {
        async function getBMI(){
            let res = await Meteor.callAsync(`patient.${loinc}`, 1);
            setVal(res[res.length - 1].valueQuantity.value);
        }

        getBMI();
    }, []);

    return (
        <div className={className}>
            <h3>{label}</h3>
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
                />
                : 'BMI data not found'
            }
        </div>
    )
}

export default Gauge;