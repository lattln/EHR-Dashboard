import GaugeComponent from "react-gauge-component";
import React, { useEffect, useState } from "react";

function Gauge({ max, min, steps, loinc, className, label }){
    const [value, setVal] = useState(5);

    useEffect(() => {
        Meteor.callAsync(`patient.${loinc}`, 1).then((data) => {
            let value = data[data.length - 1].valueQuantity;
            setVal(value.value);
        })
    }, []);

    return (
        <div className={className}>
            <h3>{label}</h3>
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
        </div>
    )
}

export default Gauge;