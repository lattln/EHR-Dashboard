import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { getSleepLog } from "../../../../../api/FitBit/fitbit";
import fitBitUtils from "../../../../../api/FitBit/utils";
import {
    Chart,
    ArcElement,
    Legend,
    Tooltip
} from 'chart.js';

Chart.register(
    ArcElement,
    Legend,
    Tooltip,
);

function SleepLog({ fitBitLinked }){
    const [stageData, setStageData] = useState({
        labels: ["Deep", "Light", "REM", "Awake"],
        datasets: [{}] 
    });

    const [durationData, setDurationData] = useState({
        labels: ["Minutes"],
        datasets: [{}]
    })

    const [efficiency, setEfficiency] = useState(0);
    const [goal, setGoal] = useState(480);
    const [duration, setDuration] = useState(0);
    
    const durationOptions = {
        indexAxis: 'y',
        scales: {
            x: {
                stacked: true,
                display: false
            },
            y: {
                stacked: true,
                display: false
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
    useEffect(() => {
        async function sleep(){
            let res = await getSleepLog();
            setStageData({...stageData, datasets: res.summary });
            setEfficiency(res.efficiency);
            setDurationData({...durationData, datasets: res.durationData })
            setDuration(res.duration);
            setGoal(res.goal);
        }

        sleep();
    }, [fitBitLinked])

    return (
        <>
            <h2 className="text-lg font-bold">Sleep Tracking</h2>
            {
                fitBitLinked ? 
                <>
                    <h2>Efficiency:</h2>
                    <h1 className="text-6xl my-5 text-center">{ efficiency }</h1>
                    <Doughnut data={stageData} />
                    <h2>Duration: {fitBitUtils.minToHours(duration)} / {fitBitUtils.minToHours(goal)}</h2>
                    <Bar data={durationData} options={durationOptions} /> 
                </>
                : "Link your FitBit account to access this widget"
            }
        </>
    )
};

export default SleepLog;