import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getSleepDuration } from "../../../../../api/FitBit/fitbit";
import fitBitUtils from "../../../../../api/FitBit/utils";

function SleepDuration({ fitBitLinked }){
	const [durationData, setDurationData] = useState({
		labels: ["Minutes"],
		datasets: [{}]
	});
	const [sleepLogExists, setSleepLogExists] = useState(false);
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
			let res = await getSleepDuration();
			
			if(res.success){
				setSleepLogExists(true);
				setDurationData({...durationData, datasets: res.durationData })
				setDuration(res.duration);
				setGoal(res.goal);
			}
		}

		if(fitBitLinked){
			sleep();
		}
	}, [fitBitLinked])

	return (
		<>
			<h2 className="text-lg font-bold">Sleep Tracking</h2>
			{
					fitBitLinked ? 
					sleepLogExists ? 
					<>
						<h2>Duration: {fitBitUtils.minToHours(duration)} / {fitBitUtils.minToHours(goal)}</h2>
						<Bar data={durationData} options={durationOptions} /> 
					</> : <p>No Data Available</p>
					: "Link your FitBit account to access this widget"
			}
		</>
	)
};

export default SleepDuration;