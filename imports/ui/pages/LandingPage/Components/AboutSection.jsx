import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
    return (
        <motion.section
            id="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-white text-gray-800 py-16"
        >
            <div className="container mx-auto text-center">
                <motion.h2
                    className="text-3xl font-semibold mb-4"
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1 }}
                >
                    What is EHR Dashboard?
                </motion.h2>
                <motion.p
                    className="text-lg mb-8"
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1 }}
                >
                    EHR Dashboard helps healthcare professionals and organizations visualize patient data with ease.
                    Track vital metrics, lab results, and make informed decisions for better patient care.
                </motion.p>
            </div>
        </motion.section>
    );
};

export default AboutSection;
