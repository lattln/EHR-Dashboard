import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGES } from "../../constants/devLanding";

const DevLanding = () => {
    const nav = useNavigate();

    const handleClick = (route) => {
        nav(route);
    };

    return (
        <div className="px-8 py-10 min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="text-center">
                <h1 className="text-4xl font-semibold text-gray-800 pt-3">
                    Quick Page Access
                </h1>

                <div className="pt-6 flex flex-wrap gap-3 justify-center">
                    {PAGES.map((page) => (
                        <button
                            key={page.id}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                            onClick={() => handleClick(page.route)}
                        >
                            {page.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DevLanding;
