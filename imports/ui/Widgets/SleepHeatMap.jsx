import React, { useEffect, useState } from "react";
import { Meteor } from 'meteor/meteor';
import { HeatMapGrid } from 'react-grid-heatmap';

function SleepHeatMap({ fitBitLinked }){
	const yLabels = [];
	const [xLabels, setXLabels] = useState([]);  
	const [data, setData] = useState([[]]);

	useEffect(() => {
		async function logs(){
			let res = await Meteor.callAsync('fitbit.getSleepHeatMap');
			setXLabels(res.days);
			setData([res.data]);
		}

		if(fitBitLinked){
			logs();
		}
	}, [fitBitLinked])

	return (
		<>
			{
				fitBitLinked ?
				<HeatMapGrid
					xLabels={xLabels}
					yLabels={yLabels}
					data={data}
					cellHeight="7rem"
					cellRender={(x, y, val) => (
						<p>{val}</p>
					)}
					xLabelsPos="bottom"
				/>
				: "Link your FitBit account to access this widget"
			}
		</>
	)
}

export default SleepHeatMap;