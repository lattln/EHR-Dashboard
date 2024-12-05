import React, { useState } from "react";
import VBar from './charts/VBar.jsx';
import Line from './charts/Line.jsx';
import HBar from './charts/HBar.jsx';
import Scatter from './charts/Scatter.jsx';

function ChartTypes(){
    const lineData = [
        {
            name: 'Jack',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        },
        {
            name: 'Austin',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90]
        },
        {
            name: 'Lin',
            data: [9, 8, 7, 6, 5, 4, 3, 2, 1]
        },
        {
            name: 'Noah',
            data: [90, 80, 70, 60, 50, 40, 30, 20, 10]
        },
        {
            name: 'Collin',
            data: [25, 25, 25, 25, 25, 25, 25, 25, 25]
        }
    ]

    const scatterData = [
        {
            name: 'Jack',
            data: [
                {x: 10, y: 1},
                {x: 9, y: 2},
                {x: 8, y: 3},
                {x: 7, y: 4},
                {x: 6, y: 5},
                {x: 5, y: 6},
                {x: 4, y: 7},
                {x: 3, y: 8},
                {x: 2, y: 9},
            ]
        },
    ];

    const barData = {
        label: 'Hours Spent',
        data: [100, 135, 189, 300, 120]
    }
}

export default ChartTypes;