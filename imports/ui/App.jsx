import React from 'react';
import { Hello } from './components/Hello.jsx';
import { Info } from './components/Info.jsx';
import { NavBar } from './components/NavBar.jsx';
import { ExampleChart } from './components/ExampleChart.jsx';

export const App = () => (
    <div>
        <NavBar />
        <Hello />
        <Info />
        <ExampleChart />

    </div>
);
