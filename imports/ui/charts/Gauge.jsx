import GaugeComponent from "react-gauge-component";
import React, { useEffect, useState, useMemo } from "react";
import { resetZoom } from "chartjs-plugin-zoom";

// probably want to move these two helpers into a utility file
function getColorForStep(step, totalSteps) {
    const mid = (totalSteps - 1) / 2;
    let r, g, b;
    b = 0;
  
    // right now its interpolating from green to red, 
    // but i need to find a better algo later on to include other colors
    if (step <= mid) {
        const ratio = step / mid;
        r = Math.round(200 - ratio * 200);
        g = Math.round(0 + ratio * 200);
    } else {
        const ratio = (step - mid) / (totalSteps - 1 - mid);
        r = Math.round(0 + ratio * 200);
        g = Math.round(200 - ratio * 200)
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  function generateGaugeSteps(gaugeMin, gaugeMax, numSteps = 5) {
    const range = gaugeMax - gaugeMin;
    const stepSize = range / numSteps;
    const steps = [];
    for (let i = 0; i < numSteps; i++) {
      steps.push({
        min: gaugeMin + i * stepSize,
        max: gaugeMin + (i + 1) * stepSize,
        color: getColorForStep(i, numSteps)
      });
    }
    return steps;
  }

function Gauge({ max, min, loinc, className, label }){
    const [value, setVal] = useState(null);
    const [gaugeMin, setGaugeMin] = useState(min);
    const [gaugeMax, setGaugeMax] = useState(max);

    useEffect(() => {
        async function fetchData() {
            patientID = 1       // placeholder for now
            try {
                let res = await Meteor.callAsync('patient.getHeightMetrics', patientID);
                if (res && res.length) {
                    height = res[res.length - 1].valueQuantity.value;
                }
                res = await Meteor.callAsync('patient.getWeightMetrics', patientID);
                if (res && res.length) {
                    weight = res[res.length - 1].valueQuantity.value;
                }

                userData = {
                    age: 40,        // should have an endpoint for this soon
                    gender: 'male',
                    height: height,
                    weight: weight
                }
                const rangeRes = await Meteor.callAsync('openai.getMinMax', label, userData);
                
                if (rangeRes.status === 'success') {
                    setGaugeMax(rangeRes.data.max);
                    setGaugeMin(rangeRes.data.min);
                }
            } catch (error) {
                console.error(error);
            }

            try {
                let res = await Meteor.callAsync(`patient.${loinc}`, patientID);
                if (res && res.length) {
                    setVal(res[res.length - 1].valueQuantity.value);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    const steps = useMemo(() => generateGaugeSteps(gaugeMin, gaugeMax, 5), [gaugeMin, gaugeMax])

    return (
        <div className={className}>
            <h3>{label}</h3>
            {value ?
                <GaugeComponent
                    minValue={gaugeMin}
                    maxValue={gaugeMax}
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