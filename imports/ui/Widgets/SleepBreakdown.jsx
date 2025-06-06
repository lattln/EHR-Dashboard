import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Meteor } from 'meteor/meteor';
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

function SleepBreakdown({ fitBitLinked }){
	const [stageData, setStageData] = useState({
		labels: ["Deep", "Light", "REM", "Awake"],
		datasets: [{}] 
	});
	const [sleepLogExists, setSleepLogExists] = useState(false);

	useEffect(() => {
		async function sleep(){
			let summary = await Meteor.callAsync('fitbit.getSleepBreakdown');
			if(summary.success){
				setStageData({...stageData, datasets: summary.data });
				setSleepLogExists(true);
			}
		}

		if(fitBitLinked){
			sleep();
		}
	}, [fitBitLinked])

	return (
		<>
			{
				fitBitLinked ? 
				sleepLogExists ? <Doughnut data={stageData} /> : <p>No Data Available</p> 
				: "Link your FitBit account to access this widget"
			}
		</>
	)
};

export default SleepBreakdown;