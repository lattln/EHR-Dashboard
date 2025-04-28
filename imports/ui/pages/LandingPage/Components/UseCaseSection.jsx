import React from 'react';
import { motion } from 'framer-motion';

const UseCaseSection = () => {
    return (
        <section id="usecases" className="bg-gray-50 py-20">
            <div className="container mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
                <motion.h2
                    className="text-3xl font-semibold text-gray-800"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    Trusted by Healthcare Teams Worldwide
                </motion.h2>
                <motion.p
                    className="text-gray-600"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    From small clinics to large hospitals, our FHIR-powered dashboard keeps you connected to patient data 24/7.
                </motion.p>
            </div>

            <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row gap-6">
                {/* Stat Card */}
                <motion.div
                    className="flex-1 bg-white rounded-xl shadow-lg p-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-4xl font-bold mb-2">12K+</div>
                    <div className="text-xl font-semibold mb-2">Patients Monitored</div>
                    <p className="text-gray-600 mb-4">
                        Visualize thousands of patient records in one unified view.
                    </p>
                    <a
                        href="#features"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Learn More&nbsp;→
                    </a>
                </motion.div>

                {/* Integration Cards */}
                {[
                    {
                        title: 'FHIR Integration',
                        desc: 'Connect to any FHIR server for live patient data.'
                    },
                    {
                        title: 'Echo Chatbot',
                        desc: 'Query your EHR via natural-language chat—no code required.'
                    }
                ].map((f, i) => (
                    <motion.div
                        key={i}
                        className="flex-1 bg-white rounded-xl shadow-lg p-6"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.2 }}
                    >
                        <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                        <p className="text-gray-600">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default UseCaseSection;
