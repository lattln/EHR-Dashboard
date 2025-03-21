import React from "react";
import { USER_INFO } from "./dashBoardData";

const Header = ({ }) => {

    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center sm:justify-end">
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


            <div className="flex justify-evenly items-center">
                <h3 className="text-lg font-bold text-gray-800">Hi, {USER_INFO.name.firstName} {USER_INFO.name.lastName}</h3>
                <img src="/blank.webp" className="ml-3 w-10 h-10 sm:w-15 sm:h-15 rounded-full"></img>
            </div>
        </div>
    );
};

export default Header;
