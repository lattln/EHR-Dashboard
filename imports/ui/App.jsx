import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { NavBar } from './NavBar.jsx';

export const App = () => (
  <div>
    <NavBar/>
    <Hello/>
    <Info/>
    
  </div>
);
