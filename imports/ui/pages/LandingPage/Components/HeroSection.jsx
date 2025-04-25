import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-blue-900 text-white text-center py-16"
        >
            <div className="container mx-auto">
                <motion.h1
                    className="text-4xl font-bold mb-4"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Unlock the Power of Data with EHR Dashboard
                </motion.h1>
                <p className="text-xl mb-6">
                    Visualize patient data and improve clinical decision-making
                </p>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="bg-orange-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-orange-400 transition duration-300"
                >
                    Get Started
                </motion.button>
            </div>
        </motion.section>
    );
};

export default HeroSection;
