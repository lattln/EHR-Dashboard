import React, { useState, useEffect } from 'react';
import { Bar as BarChart} from 'react-chartjs-2';
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
  Legend
);

function VBar({ xTitle, yTitle, xLabels, datasets, width }){
    const [data, setData] = useState({
        labels: xLabels,
        datasets: [datasets]
    })

    const options = {
        scales: {
            y: {
                title: {
                    display: true,
                    text: yTitle
                }
            },
            x: {
                title: {
                    display: true,
                    text: xTitle
                }
            }
        },
    }

    const barColors = [
        'rgb(255, 99, 132)',
        'rgb(53, 162, 235)',
        '#c51d34',
        '#6c6960',
        '#1c1c1c',
        '#734222',
        '#8673a1'
    ];

    return ( 
        <div className={`w-${width} h-1/3`}>
            <BarChart data={data} options={options}/>
        </div>
    )
}

export default VBar;