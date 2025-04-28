import React from 'react';
import { motion } from 'framer-motion';
import { IconChatBot, IconDashboard, IconLabReport, IconSetting } from '../../svgLibrary';

const FeatureSection = () => {
    const features = [
        {
            title: 'Lab View',
            description: 'Dive into historical and current lab results with rich visuals.',
            img: <IconLabReport className={"w-16 h-16 mx-auto mb-4 text-sm"}/>
        },
        {
            title: 'Clinician Dashboard',
            description: 'Manage patient assignments, notes, and tasks in one place.',
            img: <IconDashboard className={"w-16 h-16 mx-auto mb-4 text-sm"}/>
        },
        {
            title: 'Settings & Presets',
            description: 'Drag-and-drop widgets, save multiple dashboard layouts.',
            img: <IconSetting className={"w-16 h-16 mx-auto mb-4 text-sm"}/>
        },
        {
            title: 'Echo Chatbot',
            description: 'Ask questions of your EHR data using natural language.',
            img: <IconChatBot className={"w-16 h-16 mx-auto mb-4 text-sm"}/>
        },
    ];

    const loopFeatures = [...features, ...features];

    return (
        <section id="features" className="relative overflow-hidden bg-white py-16 scroll-mt-16">
            <div className="container mx-auto text-center mb-8">
                <motion.h2
                    className="text-3xl font-semibold"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    Key Features
                </motion.h2>
            </div>

            <div className="overflow-hidden pb-8">
                <motion.div
                    className="flex space-x-8"
                    style={{ width: 'max-content' }}
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 60,
                            ease: 'linear'
                        }
                    }}
                >
                    {loopFeatures.map((m, i) => (
                        <div
                            key={i}
                            className="min-w-[200px] bg-white rounded-xl shadow-lg p-4 flex-shrink-0 text-center"
                        >
                            {m.img}
                            <h3 className="text-lg font-medium mb-1">{m.title}</h3>
                            <p className="text-sm text-gray-500">{m.description}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeatureSection;
