import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Meteor } from 'meteor/meteor';
import { format } from 'date-fns';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import colors from "./colors";
import { useUser } from "../User";

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

function Weight({}){
	const [data, setData] = useState({
		datasets: []
	});
	const { user, id } = useUser();

	const [options, setOptions] = useState({
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
		}
	})


	useEffect(() => {
		async function getWeight(){
			let data = await Meteor.callAsync('patient.getWeightMetrics', id);
			let newDataset = {
				label: 'Weight',
				data: [],
				pointRadius: 3,
				pointBackgroundColor: colors[0],
				borderColor: colors[0],
				backgroundColor: colors[0]
			}
			data.map((dataPoint) => {
				newDataset.data.push({ 
					x: format(new Date(dataPoint.dateIssued), 'y-MM-dd'),
					y: dataPoint.valueQuantities[0].value
				})
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
							text: data[0].valueQuantities[0].unit
						}
					}
				},
			})
			setData({ datasets: [newDataset] });
		}

		getWeight();
	}, [])

	return (
		<div>
			<Line height={250} options={options} data={data} />
		</div>
	)
};

export default Weight;