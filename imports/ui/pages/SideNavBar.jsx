import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRole } from "../RoleContext";
import { SIDEBAR_DATA_CLINICIAN } from "./constantsPages";
import { SIDEBAR_DATA_PATIENT } from "./constantsPages";



const SideNavBar = () => {

    const { role } = useRole();

    const sidebarData = role === 'patient' ? SIDEBAR_DATA_PATIENT : SIDEBAR_DATA_CLINICIAN

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
                <div className="pt-6 pb-6 pl-3">
                    <Link to="/dev">
                        <div className="text-white ">
                            <h1 className="text-2xl font-semibold">HEALTHBRIDGE</h1>
                        </div>
                    </Link>
                </div>

                {sidebarData.map((link, index) => (
                    <motion.div
                        key={link.name + index}
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
