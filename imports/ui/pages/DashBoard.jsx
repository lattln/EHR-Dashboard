import React, { useEffect } from 'react';
import Header from '../components/DashBoard/Header';
import ChartList from '../charts';
import { PLACEHOLDER, USER_INFO } from '../constants/dashBoard';
import { useState } from 'react';


const DashBoard = () => {
    const [charts, setCharts] = useState([
        {
            type: 'Line',
            height: 1,
            width: 2,
            loinc: 'getWeightMetrics', 
            label: 'Weight'
        },
        {
            type: 'Line',
            height: 1,
            width: 1,
            loinc: 'getHeightMetrics', 
            label: 'Height'
        },
        {
            type: 'Line',
            height: 1,
            width: 2,
            loinc: 'getDiastolicBloodPressureMetrics', 
            label: 'Diastolic Blood Pressure'
        },
        {
            type: 'Line',
            height: 1,
            width: 1,
            loinc: 'getSystolicBloodPressureMetrics', 
            label: 'Systolic Blood Pressure'
        },
        {
            type: 'Line',
            height: 1,
            width: 1,
            loinc: 'getBMIMetrics', 
            label: 'BMI'
        },
    ]);

    function changeSize(e, idx){
        let width = 1;
        let height = 1;
        switch(e.target.value){
            case 'med':
                width = 2;
                break;
            case 'large':
                height = 2;
                width = 2;
                break;
            case 'tall':
                height = 2;
                width = 1;
                break;
        }

        setCharts(charts.map((c, i) => {
            if(i === idx){
                return { ...c, height: height, width: width }
            } else {
                return c;
            }
        }))
    }

    useEffect(() => {
    }, [charts]);

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
                                let selectedSize = 'small';
                                if(chart.height > 1 && chart.width > 1){
                                    selectedSize = 'large';
                                } else if(chart.height > 1){
                                    selectedSize = 'tall'
                                } else if(chart.width > 1){
                                    selectedSize = 'med';
                                }
                                return (
                                    <div 
                                        className="bg-base-100 p-6 rounded-lg shadow min-h-80 max-h-full" 
                                        key={idx}
                                        style={{gridColumnStart: "span " + chart.width, gridRowStart: "span " + chart.height}}
                                    >
                                        <ChartElement loinc={chart.loinc} label={chart.label} className='h-5/6' />
                                        <select className='select select-bordered h-1/6 max-h-12' value={selectedSize} onChange={(e) => changeSize(e, idx)}>
                                            <option value="small">Small</option>
                                            <option value="med">Medium</option>
                                            <option value="large">Large</option>
                                            <option value="tall">Tall</option>
                                        </select>
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
