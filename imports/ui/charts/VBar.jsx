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

function VBar({ loinc }){
    const barColors = [
        'rgb(255, 99, 132)',
        'rgb(53, 162, 235)',
        '#c51d34',
        '#6c6960',
        '#1c1c1c',
        '#734222',
        '#8673a1'
    ];
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
                    text: "Team member" 
                }
            }
        }
    }

    return <BarChart data={barData} options={options} />;
}

export default VBar;