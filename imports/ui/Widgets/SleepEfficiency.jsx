import React, { useEffect, useState } from "react";
import { getSleepEfficiency } from "../../api/FitBit/fitbit";

function SleepEfficiencey({ fitBitLinked }){
	const [efficiency, setEfficiency] = useState(0);
	const [sleepLogExists, setSleepLogExists] = useState(false);

	useEffect(() => {
		async function efficiency(){
			let res = await getSleepEfficiency();

			if(res.efficiency != -1){
				setSleepLogExists(true);
				setEfficiency(res.efficiency);
			}
		}

		if(fitBitLinked){
			efficiency();
		}
	}, [fitBitLinked])

	return (
		<>
			{
				fitBitLinked ? 
					sleepLogExists ? 
					<h1 className="text-9xl my-5 text-center">{ efficiency }</h1> 
					: <p>No Data Available</p> 
				: "Link your FitBit account to access this widget"
			}
		</>
	)
};

export default SleepEfficiencey;