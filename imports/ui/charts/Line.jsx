import React, { useState, useEffect } from "react";
import { Line as LineChart } from 'react-chartjs-2';
import { format } from 'date-fns';
import 'chartjs-adapter-date-fns';
import zoomPlugin from "chartjs-plugin-zoom";
import { 
    Chart,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
} from "chart.js";

Chart.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    zoomPlugin
);

function Line({ className, label, loinc }){
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
        datasets: []
    });
    
    const [options, setOptions] = useState({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: label
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    mode: 'xy',
                }
            }
        }
    })

    useEffect(() => {
        let newDataset = {
            label: label,
            data: [],
            pointRadius: 3,
            pointBackgroundColor: lineColors[0],
            borderColor: lineColors[0],
            backgroundColor: lineColors[0]
        }

        Meteor.callAsync(`patient.${loinc}`, 1).then((dataPoints) => {
            if(dataPoints.length < 1){
                return;
            }

            dataPoints.map((dataPoint) => {
                newDataset.data.push({
                    x: format(new Date(dataPoint.dateIssued), 'y-MM-dd'),
                    y: dataPoint.valueQuantities[0].value 
                })
                console.log(dataPoint);
            })

            setOptions({ ...options, 
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            tooltipFormat: 'MMM y',
                            unit: 'month'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: dataPoints[0].valueQuantities[0].unit
                        }
                    }
                },
            })
            setData({ datasets: [newDataset] });
        })

        return () => {}
    }, [])

    return (
        <div className={className}>
            <LineChart data={data} options={options}/>
        </div>
    )
}

export default Line;