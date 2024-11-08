import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export const ExampleChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const data = {
            labels: ['Member 1', 'Member 2', 'Member 3', 'Member 4', 'Member 5'],
            datasets: [
                {
                    label: 'Total Hours',
                    data: [34, 30, 32, 36, 34.25],
                    backgroundColor: ['#4A90E2', '#F5A623', '#F8E71C', '#7ED321', '#D0021B'],
                },
            ],
        };

        const options = {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Sprint Goals (8 Hours/2-Week Sprint)',
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Team Member Contributions',
                },
                legend: {
                    display: false,
                },
            },
        };

        chartInstance.current = new Chart(chartRef.current, {
            type: 'bar',
            data: data,
            options: options,
        });

        return () => {
            chartInstance.current.destroy();
        };
    }, []);

    return (
        <div className='w-128 h-96'>
            <canvas ref={chartRef} />
        </div>
        
    );
};

