import React from "react";

const Header = ({ }) => {
    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
            {/* Mobile Menu Button */}
            <button
                className="text-2xl sm:hidden"
                onClick={() => {
                    console.log(window.innerWidth);
                    console.log(window.outerWidth);
                    console.log(document.documentElement.clientWidth);

                }}
            >
                ☰
            </button>

            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

            <div>
                <input
                    type="text"
                    placeholder="Search"
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};

export default Header;
