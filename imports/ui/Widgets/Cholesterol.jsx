import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import colors from './colors';
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

function Cholesterol({ recommendedLevels=[160, 60] }){
    const [barData] = useState({
        labels: ['LDL', 'HDL'],
        datasets: [
            {
                label: 'Recommended',
                data: recommendedLevels,
                backgroundColor: colors[0] 
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
        async function getCholesterol(){

            console.log(data);
        }

        getCholesterol();
    }, [])

    return (
		<>
			<h2 className="text-lg font-bold">Cholesterol</h2>
			<div>
				<Bar options={options} data={barData} />
			</div>
		</>
    )
}

export default Cholesterol;