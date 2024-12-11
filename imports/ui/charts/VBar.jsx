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
    const [barData] = useState({
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

    return (
        <div className={className}>
            <BarChart data={barData} options={options} />;
        </div>
    )
}

export default VBar;