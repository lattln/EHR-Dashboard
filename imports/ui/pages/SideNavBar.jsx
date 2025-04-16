import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRole } from "../RoleContext";
import { SIDEBAR_DATA_CLINICIAN, SIDEBAR_DATA_PATIENT } from "./constantsPages";

const SideNavBar = ({ onCloseMobile }) => {
    const { role } = useRole();
    const sidebarData = role === 'patient' ? SIDEBAR_DATA_PATIENT : SIDEBAR_DATA_CLINICIAN;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full"
        >
            <div className="flex flex-col h-full w-60 bg-blue-600 shadow-lg px-6 py-4 space-y-7 relative">
                {/* Mobile close button */}
                <button
                    className="absolute top-4 right-4 text-white text-2xl md:hidden"
                    onClick={onCloseMobile}
                >
                    ✕
                </button>

                {/* Logo */}
                <div className="pt-6 pb-6 pl-3">
                    <Link to="/dev">
                        <h1 className="text-2xl font-semibold text-white">HEALTHBRIDGE</h1>
                    </Link>
                </div>

                {/* Nav Links */}
                {sidebarData.map((link, index) => (
                    <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="w-full"
                    >
                        <Link
                            to={link.route}
                            className="text-white hover:text-gray-300 pl-3 flex flex-row space-x-4 hover:bg-blue-500 p-4 rounded-lg"
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default SideNavBar;
