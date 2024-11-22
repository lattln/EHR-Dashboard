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

function Line({xTitle, yTitle, xLabels, datasets, width }){
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
        datasets: [],
        labels: xLabels,
    });
    
    const options = {
        responsive: true,
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

    useEffect(() => {
        let formattedDatasets = [];
        datasets.map((d, idx) => {
            formattedDatasets.push({
                label: d.name,
                data: d.data,
                borderColor: lineColors[idx],
                backgroundColor: lineColors[idx]
            })
        })

        setData({...data, datasets: formattedDatasets});
    }, [datasets]);

    return ( 
        <div className={`w-${width} h-1/3`}>
            <LineChart data={data} options={options}/>
        </div>
    )
}

export default Line;