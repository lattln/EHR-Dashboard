import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { getHeartRate } from "../../../../../api/FitBit/fitbit";

function HeartRate({}){
    const [timeData, setTimeData] = useState({
        labels: ["Out of Range", "Fat Burn", "Cardio", "Peak"],
        datasets: []
    })
    useEffect(() => {
        async function hr(){
            let res = await getHeartRate();
            setTimeData({ ...timeData, datasets: res.timeData })
        }
        
        hr();
    }, []);

    return (
        <div>
            <h2 className="text-lg font-bold">Heart Rate</h2>
            <p>Yesterday's Heart Rate </p>
            <Doughnut data={timeData} />
        </div>
    )
};

export default HeartRate;