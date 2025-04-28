import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white bg-opacity-30 backdrop-blur-md sticky top-0 z-50"
        >
            <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-row items-center justify-between h-16">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    EHR Dashboard
                </Link>

                {/* desktop menu */}
                <div className="hidden md:flex space-x-8 text-gray-700 items-center">
                    <a href="#about"    className="hover:text-gray-900">About</a>
                    <a href="#features" className="hover:text-gray-900">Features</a>
                    <Link to="/auth"    className="hover:text-gray-900">Sign In</Link>
                </div>

                {/* mobile toggle */}
                <button
                    onClick={() => setIsOpen(v => !v)}
                    className="md:hidden text-gray-700 focus:outline-none"
                >
                    <div className="space-y-1">
                        <span className={`block h-0.5 w-6 bg-gray-700 transform transition ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                        <span className={`block h-0.5 w-6 bg-gray-700 transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <span className={`block h-0.5 w-6 bg-gray-700 transform transition ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </div>
                </button>
            </div>

            {/* mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white bg-opacity-30 backdrop-blur-md"
                    >
                        <div className="flex flex-col px-6 py-4 space-y-3">
                            <a href="#about"    onClick={() => setIsOpen(false)} className="hover:text-gray-900">About</a>
                            <a href="#features" onClick={() => setIsOpen(false)} className="hover:text-gray-900">Features</a>
                            <Link to="/auth"    onClick={() => setIsOpen(false)} className="hover:text-gray-900">Sign In</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default NavBar;
