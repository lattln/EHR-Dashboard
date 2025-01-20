import React, { useState, useEffect } from "react";
import { Scatter as ScatterChart } from 'react-chartjs-2';
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

function Scatter({ xTitle, yTitle, datasets, width }){
    const lineColors = [
        'rgb(255, 99, 132)',
        'rgb(53, 162, 235)',
        '#c51d34',
        '#6c6960',
        '#1c1c1c',
        '#734222',
        '#8673a1'
    ]
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
                        speed: 100
                    },
                    mode: 'xy',
                }
            }
        }
    }

    const [data, setData] = useState({
        datasets: [],
    });

    useEffect(() => {
        let formattedDatasets = [];
        datasets.map((d, idx) => {
            formattedDatasets.push({
                label: d.name,
                data: d.data,
                backgroundColor: lineColors[idx]
            })
        })
        console.log(formattedDatasets);

        setData({...data, datasets: formattedDatasets});
    }, [datasets]);

    return ( 
        <div className={`w-${width} h-1/3`}>
            <ScatterChart data={data} options={options} />
        </div>
    )
}

export default Scatter;