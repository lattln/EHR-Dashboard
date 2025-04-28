import React from 'react';
import { motion } from 'framer-motion';
import DemoLabResult from './DemoLabResult';

const HeroSection = () => (
    <motion.section
        id='hero'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white pt-20 pb-24"
    >
        <div className="container mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left Text */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Unlock the Power of Your EHR Data
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                    Visualize patient metrics, lab results, and trends in real-time to drive better clinical decisions.
                </p>
                <a
                    href="#features"
                    className="inline-flex items-center text-blue-600 font-medium hover:underline"
                >
                    Explore Features&nbsp;→
                </a>
            </motion.div>

            {/* Right Graphic Placeholder */}
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
            >
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-bold text-2xl ">Lab Results Tracking</h3>
                    <p className="text-gray-500 mt-2">Real-time insights into every patient's labs.</p>
                </div>
                <DemoLabResult />
            </motion.div>
        </div>
    </motion.section>
);

export default HeroSection;
