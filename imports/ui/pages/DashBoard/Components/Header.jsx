import React from 'react';

const Header = () => {
    return (
        <div className="bg-base-100 shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary">Dashboard</h1>
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-48"
                />
            </div>
        </div>
    );
};

export default Header;
