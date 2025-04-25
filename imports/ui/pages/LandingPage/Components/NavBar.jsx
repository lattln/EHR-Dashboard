import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 text-white w-full z-10 p-4 sticky top-0"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-semibold">EHR Dashboard</Link>
                <div className="space-x-4">
                    <Link to="#about" className="hover:text-gray-400">About</Link>
                    <Link to="#features" className="hover:text-gray-400">Features</Link>
                    <Link to="#signup" className="hover:text-gray-400">Sign Up</Link>
                    <Link to="#contact" className="hover:text-gray-400">Contact</Link>
                </div>
            </div>
        </motion.nav>
    );
};

export default NavBar;
