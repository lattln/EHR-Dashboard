import React, { useState, useEffect } from 'react';
import { Bar as BarChart} from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  zoomPlugin,
  Legend
);

function VBar({ loinc, label, className }){
    const barColors = [
        'rgb(255, 99, 132)',
        'rgb(53, 162, 235)',
        '#c51d34',
        '#6c6960',
        '#1c1c1c',
        '#734222',
        '#8673a1'
    ];
    const [barData, setBarData] = useState({
    const [barData, setBarData] = useState({
        labels: ['LDL', 'HDL'],
        datasets: [
            {
                label: 'Recommended Levels',
                data: [160, 60],
                backgroundColor: barColors[0] 
            },
            {
                label: 'Actual Levels',
                data: [120, 80],
                backgroundColor: barColors[1] 
            },
        ],
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    mode: 'xy',
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "mg/dL" 
                }
            },
        }
    }

    useEffect(() => {
        async function fetchRecommendedLevels() {
            const userData = {
                age: 40,
                gender: 'male'
            }

            try {
                // this is hard coded in for LDL and HDL for now, but we should get a way
                // to pass in the loinc/label instead
                const ldlRes = await Meteor.callAsync('ozwell.getRecommended', 'LDL', userData);
                const hdlRes = await Meteor.callAsync('ozwell.getRecommended', 'HDL', userData);

                if (ldlRes.status === 'success' && hdlRes.status === 'success') {
                    const ldlRecommended = ldlRes.data.recommended;
                    const hdlRecommended = hdlRes.data.recommended;

                    setBarData(prevData => {
                        const updatedData = prevData.datasets.map(dataset => {
                            if (dataset.label === 'Recommended Levels') {
                                return {
                                    ...dataset,
                                    data: [ldlRecommended, hdlRecommended]
                                };
                            }
                            return dataset;
                        });
                        return { ...prevData, datasets: updatedData };
                    })
                }

            } catch (error) {
                console.error(error);
            }
        }

        fetchRecommendedLevels();
    }, [])

    return (
        <div className={className}>
            <BarChart data={barData} options={options} />;
        </div>
    )
}

export default VBar;