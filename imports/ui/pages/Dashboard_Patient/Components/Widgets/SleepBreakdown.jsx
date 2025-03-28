import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { getSleepBreakdown } from "../../../../../api/FitBit/fitbit";
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

	useEffect(() => {
		async function sleep(){
			let summary = await getSleepBreakdown();
			setStageData({...stageData, datasets: summary });
		}

		sleep();
	}, [fitBitLinked])

	return (
		<>
			{
					fitBitLinked ? 
					<Doughnut data={stageData} />
					: "Link your FitBit account to access this widget"
			}
		</>
	)
};

export default SleepBreakdown;