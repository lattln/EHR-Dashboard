import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { NavBar } from './NavBar.jsx';
import { ExampleChart } from './ExampleChart.jsx';

export const App = () => (
  <div>
    <NavBar/>
    <Hello/>
    <Info/>
    <ExampleChart/>
    
  </div>
);
