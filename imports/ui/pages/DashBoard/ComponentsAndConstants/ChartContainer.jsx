import React, { useState } from 'react';
import ChartList from '../../../charts'

const ChartContainer = () => {
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
                { color: '#FFA500', limit: 17, showTick: true },
                { color: '#FFFF00', limit: 18.5, showTick: true },
                { color: '#00FF00', limit: 25, showTick: true },
                { color: '#FFFF00', limit: 30, showTick: true },
                { color: '#FFA500', limit: 35, showTick: true },
                { color: '#FF0000', limit: 40, showTick: true }
            ]
        },
        { type: 'Line', height: 1, width: 2, loinc: 'getWeightMetrics', label: 'Weight' },
        { type: 'Line', height: 1, width: 1, loinc: 'getHeightMetrics', label: 'Height' },
        { type: 'VBar', height: 1, width: 1, loinc: 'cholesterolMetrics', label: 'Cholesterol levels (HDL, LDL)' }
    ]);

    const removeChart = (idx) => {
        setCharts(charts.toSpliced(idx, 1));
    };

    const changeSize = (e, idx) => {
        let width = 1;
        let height = 1;
        switch (e.target.value) {
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

        setCharts(charts.map((c, i) => (i === idx ? { ...c, height, width } : c)));
    };

    return (
        <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-3 gap-5">
            {charts.map((chart, idx) => {
                const ChartElement = ChartList[chart.type];
                let selectedSize = chart.height > 1 && chart.width > 1 ? 'large' : chart.height > 1 ? 'tall' : chart.width > 1 ? 'med' : 'small';
                return (
                    <div
                        className="bg-base-100 p-6 rounded-lg shadow min-h-80 max-h-full bg-white"
                        key={idx}
                        style={{ gridColumnStart: `span ${chart.width}`, gridRowStart: `span ${chart.height}` }}
                    >
                        <ChartElement loinc={chart.loinc} label={chart.label} className='h-5/6' min={chart.min || ''} max={chart.max || ''} steps={chart.steps || []} />
                        <div className='flex justify-between items-center'>
                            <select className='select select-bordered max-h-12 my-auto' value={selectedSize} onChange={(e) => changeSize(e, idx)}>
                                <option value="small">Small</option>
                                <option value="med">Medium</option>
                                <option value="large">Large</option>
                                <option value="tall">Tall</option>
                            </select>
                            <button className='btn bg-primary' onClick={() => removeChart(idx)}>X</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChartContainer;
