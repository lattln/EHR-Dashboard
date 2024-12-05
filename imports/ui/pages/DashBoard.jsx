import React from 'react';
import Header from '../components/DashBoard/Header';
import ChartList from '../charts';
import { PLACEHOLDER, USER_INFO } from '../constants/dashBoard';
import { useState } from 'react';


const DashBoard = () => {
    const [charts, setCharts] = useState([
        {
            type: 'Line',
            width: '2',
            height: '1',
            loinc: `29463-7` 
        },
        {
            type: 'VBar',
            width: '1',
            height: '2',
            loinc: `29463-7` 
        },
        {
            type: 'HBar',
            width: 'full',
            height: '1',
            loinc: `29463-7` 
        },
    ]);

    return (
        <div className="flex ml-24 min-h-screen bg-base-200">

            <div className="flex flex-col flex-1">

                <Header />


                <div className="p-6 space-y-6 overflow-y-auto">

                    <div className="grid grid-cols-3 gap-6 bg-primary rounded-lg">
                        <div className=" text-primary-content p-4">
                            <p>{USER_INFO.name.label}: {USER_INFO.name.label}</p>
                            <p>{USER_INFO.birth.label}: {USER_INFO.birth.value}</p>
                        </div>
                        <div className=" text-primary-content p-4">
                            <p>{USER_INFO.physician.label}: {USER_INFO.physician.value}</p>
                            <p>{USER_INFO.gender.label}: {USER_INFO.gender.value}</p>
                        </div>
                        <div className=" text-primary-content p-4">
                            <p>{USER_INFO.lastAppt.label}: {USER_INFO.lastAppt.value}</p>
                        </div>


                    </div>

                    <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-3 gap-5">

                        {
                            charts.map((chart, idx) => {
                                const ChartElement = ChartList[chart.type];
                                return (
                                    <div className={`bg-base-100 p-6 rounded-lg shadow h-60 col-span-${chart.width} row-span-${chart.height}`} key={idx}>
                                        <ChartElement loinc={chart.loinc} />
                                    </div>
                                ) 
                            })
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
