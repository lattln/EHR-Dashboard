import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';

const Summary = () => {
    const [summary, setSummary] = useState('');

    const latestValue = (metrics) => {
        if (!metrics || metrics.length === 0) return null;
        const latest = metrics[0];
        if (latest.valueQuantity && latest.valueQuantity.value) {
            const val = parseFloat(latest.valueQuantity.value);
            return parseFloat(val.toFixed(3));
        }
        return null;
      };

    useEffect(() => {
        async function fetchSummary() {
            try {
                const patientID = 1
                const metrics = await Meteor.callAsync('patient.getSummaryMetrics', patientID);

                const payload = {
                    age: 40,
                    gender: 'male',
                    weight: latestValue(metrics.weightMetrics),
                    height: latestValue(metrics.heightMetrics),
                    bloodPressure: {
                        systolic: latestValue(metrics.systolicMetrics),
                        diastolic: latestValue(metrics.diastolicMetrics),
                    },
                    heartRate: latestValue(metrics.heartRateMetrics),
                    BMI: latestValue(metrics.BMIMetrics),
                    labResults: {
                        bodyTemp: latestValue(metrics.bodyTempMetrics),
                        oxygenSaturation: latestValue(metrics.oxygenSaturationMetrics),
                        hemoglobin: latestValue(metrics.hemoglobinMetrics),
                        hemoglobinA1C: latestValue(metrics.hemoglobinA1CMetrics),
                        ESR: latestValue(metrics.ESRMetrics),
                        glucose: latestValue(metrics.glucoseMetrics),
                        potassium: latestValue(metrics.potassiumMetrics),
                        cholesterolTotal: latestValue(metrics.cholesterolTotalMetrics),
                        LDL: latestValue(metrics.LDLMetrics),
                        HDL: latestValue(metrics.HDLMetrics),
                        BUN: latestValue(metrics.BUNMetrics),
                        creatinine: latestValue(metrics.creatinineMetrics),
                    },
                };

                console.log(payload)

                const result = await Meteor.callAsync('ozwell.getSummary', payload);
                console.log('result: ' + result)
                if (result && result.data && result.data.summary) {
                    setSummary(result.data.summary)
                }
            } catch (error) {
                console.error('Error fetching summary.', error);
                setSummary('Error fetching summary.');
            }
        }
        
        fetchSummary();
    }, []);

    return (
        <div className="w-full bg-base-100 shadow p-6">
            <h2 className="text-xl font-semibold mb-2">Your AI Summary ✨</h2>
            <p>{summary}</p>
        </div>
      );
};

export default Summary;
