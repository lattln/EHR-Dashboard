import React from "react";
import { Link } from "react-router-dom";
import { NAV_LINKS } from "./dashBoardData";
import { motion } from "framer-motion";

const SideNavBar = () => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
        >
            <div className="fixed flex h-screen w-60 bg-blue-600 shadow-lg flex-col items-start px-6 py-4 space-y-7">
                {/* Logo */}
                <div className="mb-6 flex items-center">
                    <Link to="/dev">
                        <div className="h-20 bg-white flex items-center justify-center rounded">
                            <img src="/HealthBridge.png" className="px-4"></img>
                        </div>
                    </Link>
                </div>

                {NAV_LINKS.map((link, index) => (
                    <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="w-full"
                    >
                        <Link to={link.route} className="text-white hover:text-gray-300 pl-3 flex flex-row space-x-4 hover:bg-blue-500 p-4 rounded-lg " >
                            {link.icon}
                            <div> {link.name} </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default SideNavBar;
