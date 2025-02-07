import { Meteor } from 'meteor/meteor';
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

    const generateSteps = (min, max, numSteps) => {
        const stepSize = (max - min) / numSteps;
        const colors = ['#FFA500', '#FFFF00', '#00FF00', '#FFFF00', '#FFA500', '#FF0000'];
    
        return Array.from({ length: numSteps }, (_, index) => {
            return {
                color: colors[index % colors.length],
                limit: min + stepSize * (index + 1),
                showTick: true
            };
        });
    };

    const fetchChartData = async (metricType) => {
        try {
            const s = Meteor.callAsync('patient.getRecordByIdentifier', 1)
            const response = await Meteor.callAsync('openai.send', metricType, {
                age: USER_INFO.age,
                weight: USER_INFO.weight,
                gender: USER_INFO.gender,
                height: USER_INFO.height
            });
    
            if (response?.data?.min !== undefined && response?.data?.max !== undefined) {
                setCharts(prevCharts =>
                    prevCharts.map(chart =>
                        chart.loinc === `get${metricType}Metrics`
                            ? {
                                ...chart,
                                min: response.data.min,
                                max: response.data.max,
                                steps: generateSteps(response.data.min, response.data.max, 6)
                            }
                            : chart
                    )
                );
            } else if (response?.data?.recommended !== undefined) {
                setCharts(prevCharts =>
                    prevCharts.map(chart =>
                        chart.loinc === `get${metricType}Metrics`
                            ? {
                                ...chart,
                                recommended: response.data.recommended
                            }
                            : chart
                    )
                );
            }
    
        } catch (error) {
            console.error(`Error fetching data for ${metricType}:`, error);
        }
    };
    
    useEffect(() => {
        ['BMI', 'LDL', 'HDL', 'Weight', 'Height', 'Cholesterol'].forEach(metric => fetchChartData(metric));
    }, []);

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
                            <p>{USER_INFO.name.label}: {USER_INFO.name.firstName} {USER_INFO.name.lastName}</p>
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
