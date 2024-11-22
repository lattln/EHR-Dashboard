import React, { useState } from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { NavBar } from './NavBar.jsx';
import ChartTypes from './ChartTypes.jsx';

export const App = () => (
  <div className='h-screen w-screen'>
    <h1>Hello</h1>
    <ChartTypes />
  </div>
);
