import React, { useEffect, useState } from "react";
import { getSleepEfficiency } from "../../../../../api/FitBit/fitbit";

function SleepEfficiencey({ fitBitLinked }){
	const [efficiency, setEfficiency] = useState(0);

	useEffect(() => {
		async function efficiency(){
			let res = await getSleepEfficiency();
			setEfficiency(res);
		}

		efficiency();
	}, [fitBitLinked])

	return (
		<>
			<h2 className="text-lg font-bold">Sleep Efficiency</h2>
			{
					fitBitLinked ? 
               <h1 className="text-9xl my-5 text-center">{ efficiency }</h1>
					: "Link your FitBit account to access this widget"
			}
		</>
	)
};

export default SleepEfficiencey;