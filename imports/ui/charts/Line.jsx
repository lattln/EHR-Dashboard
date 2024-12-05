import React, { useState, useEffect } from "react";
import { Line as LineChart } from 'react-chartjs-2';
import zoomPlugin from "chartjs-plugin-zoom";
import { 
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
} from "chart.js";

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    zoomPlugin
);

function Line({ loinc }){
    const lineColors = [
        'rgb(255, 99, 132)',
        'rgb(53, 162, 235)',
        '#c51d34',
        '#6c6960',
        '#1c1c1c',
        '#734222',
        '#8673a1'
    ];

    const [data, setData] = useState({
        datasets: [{
            label: 'Jack',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            borderColor: lineColors[0]
        },
        {
            label: 'Austin',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90],
            borderColor: lineColors[1]
        },
        {
            label: 'Lin',
            data: [9, 8, 7, 6, 5, 4, 3, 2, 1],
            borderColor: lineColors[2]
        },
        {
            label: 'Noah',
            data: [90, 80, 70, 60, 50, 40, 30, 20, 10],
            borderColor: lineColors[3]
        }],
        labels: ['Jan', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    });
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
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
                    text: "Months" 
                }
            }
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    mode: 'xy',
                }
            }
        }
    }

    return <LineChart className="h-full w-full" data={data} options={options}/>
}

export default Line;