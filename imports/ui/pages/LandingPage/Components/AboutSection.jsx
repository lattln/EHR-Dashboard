import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => (
    <motion.section
        id="about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-50 py-20"
    >
        <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
            <motion.h2
                className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
            >
                What is EHR Dashboard?
            </motion.h2>
            <motion.p
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
            >
                EHR Dashboard empowers healthcare teams by visualizing FHIR-based patient data:
                lab trends, vital metrics, and custom dashboards—all in one intuitive interface.
            </motion.p>
        </div>
    </motion.section>
);

export default AboutSection;
