import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export const Hello = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };

  return (
    <div className='pt-10'>
      <ThemeToggle />
      <button onClick={increment} className=' ml-2 btn btn-primary'>Click Me</button>
      <p className='mt-3'>You've pressed the button {counter} times.</p>
    </div>
  );
};
