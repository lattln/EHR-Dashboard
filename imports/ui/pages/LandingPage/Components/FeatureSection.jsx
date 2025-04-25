import React from 'react';
import { motion } from 'framer-motion';

const FeatureSection = () => {
    const features = [
        { title: "Patient Data Visualization", description: "Effortlessly view and interpret patient data." },
        { title: "Lab Results Tracking", description: "Keep track of lab results and clinical data in real-time." },
        { title: "Customizable Dashboards", description: "Build dashboards that suit your healthcare workflow." }
    ];

    return (
        <motion.section
            id="features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-gray-50 text-gray-800 py-16"
        >
            <div className="container mx-auto text-center">
                <motion.h2
                    className="text-3xl font-semibold mb-4"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Key Features
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: index * 0.3 }}
                            className="bg-white p-6 rounded-lg shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default FeatureSection;
