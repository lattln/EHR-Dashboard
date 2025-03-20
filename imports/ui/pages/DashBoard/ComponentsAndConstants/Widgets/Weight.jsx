import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { format } from 'date-fns';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
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

function Weight({ }){
	const [data, setData] = useState({
		datasets: []
	});

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

	const lineColors = [
		'rgb(255, 99, 132)',
		'rgb(53, 162, 235)',
		'#c51d34',
		'#6c6960',
		'#1c1c1c',
		'#734222',
		'#8673a1'
	];

	useEffect(() => {
		async function getWeight(){
			let data = await Meteor.callAsync('patient.getWeightMetrics', 1);
			let newDataset = {
				label: 'Weight',
				data: [],
				pointRadius: 3,
				pointBackgroundColor: lineColors[0],
				borderColor: lineColors[0],
				backgroundColor: lineColors[0]
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
		<>
			<h2 className="text-lg font-bold">Weight</h2>
			<div>
				<Line height={250} options={options} data={data} />
			</div>
		</>
	)
};

export default Weight;