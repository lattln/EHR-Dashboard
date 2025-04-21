import React from "react";
import { USER_INFO } from "./constantsPages";
import { useUser } from "../User";

const Header = ({ onMenuClick }) => {
    const { user, userLoading } = useUser();
    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center md:justify-end">
            {/* Hamburger for mobile */}
            <button
                className="text-2xl md:hidden"
                onClick={onMenuClick}
                aria-label="Toggle menu"
            >
                ☰
            </button>

            <div className="flex items-center">
                <h3 className="text-lg font-bold text-gray-800">
                    Hi, {userLoading ? "..." : user.profile.firstName + " " + user.profile.lastName} 
                </h3>
                <img
                    src="/blank.webp"
                    className="ml-3 w-10 h-10 rounded-full"
                    alt="User Avatar"
                />
            </div>
        </div>
    );
};

export default Header;
