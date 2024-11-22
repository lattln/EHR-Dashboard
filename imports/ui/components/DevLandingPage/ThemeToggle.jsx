import React, { useState } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState();

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <button
            className="btn btn-primary"
            onClick={toggleTheme}
        >
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
    );
};

export default ThemeToggle;
