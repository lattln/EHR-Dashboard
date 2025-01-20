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
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  zoomPlugin
);

function HBar({ loinc }){
    const barColors = [
        'rgb(255, 99, 132)',
        'rgb(53, 162, 235)',
        '#c51d34',
        '#6c6960',
        '#1c1c1c',
        '#734222',
        '#8673a1'
    ];

    loinc.map((code) => {
        Meteor.callAsync('patient.getHealthMetrics', code, 1).then((data) => {
            console.log(data);
        })
    })

    const [barData] = useState({
        labels: ['Jack', 'Collin', 'Lin', 'Noah', 'Austin'],
        datasets: [{
            label: 'Hours Spent',
            data: [100, 135, 189, 300, 120],
            backgroundColor: barColors
        }],
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
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
                    text: "Hours" 
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Team Member" 
                }
            }
        }
    }

    return <BarChart data={barData} options={options} />;
}

export default HBar;