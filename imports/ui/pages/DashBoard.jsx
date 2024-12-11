import React, { useEffect } from 'react';
import Header from '../components/DashBoard/Header';
import ChartList from '../charts';
import { PLACEHOLDER, USER_INFO } from '../constants/dashBoard';
import { IconSave } from '../constants/svgLibrary';
import { useState } from 'react';


const DashBoard = () => {
    const [charts, setCharts] = useState([
        {
            type: 'Gauge',
            height: 1,
            width: 1,
            loinc: 'getBMIMetrics', 
            label: 'BMI',
            min: 16,
            max: 40,
            steps: [
                {
                    color: '#FFA500',
                    limit: 17,
                    showTick: true
                },
                {
                    color: '#FFFF00',
                    limit: 18.5,
                    showTick: true
                },
                {
                    color: '#00FF00',
                    limit: 25,
                    showTick: true
                },
                {
                    color: '#FFFF00',
                    limit: 30,
                    showTick: true
                },
                {
                    color: '#FFA500',
                    limit: 35,
                    showTick: true
                },
                {
                    color: '#FF0000',
                    limit: 40, 
                    showTick: true
                }
            ]
        },
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
            type: 'VBar',
            height: 1,
            width: 1,
            loinc: 'imagine what the cholesterol one would be',
            label: 'Cholesterol levels (HDL, LDL)'
        }
    ]);

    function removeChart(idx){
        let newCharts = charts.toSpliced(idx, 1);
        setCharts(newCharts);
    }

    function saveCharts(){
        console.log(charts);
    }

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
                            <IconSave className="hover:fill-secondary hover:cursor-pointer" onClick={saveCharts} />
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
                                        <ChartElement 
                                            loinc={chart.loinc}
                                            label={chart.label}
                                            className='h-5/6'
                                            min={chart.min ? chart.min : ''}
                                            max={chart.max ? chart.max : ''}
                                            steps={chart.steps ? chart.steps : []}
                                        />
                                        <div className='flex justify-between items-center'>
                                            <select className='select select-bordered max-h-12 my-auto' value={selectedSize} onChange={(e) => changeSize(e, idx)}>
                                                <option value="small">Small</option>
                                                <option value="med">Medium</option>
                                                <option value="large">Large</option>
                                                <option value="tall">Tall</option>
                                            </select>
                                            <button className='btn bg-primary' onClick={(e) => { removeChart(idx)}}>X</button>
                                        </div>
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
