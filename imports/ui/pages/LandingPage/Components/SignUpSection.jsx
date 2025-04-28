import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SignUpSection = () => (
    <motion.section
        id="signup"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-blue-600 text-white"
    >
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-20 text-center">
            {/* Heading */}
            <motion.h2
                className="text-3xl md:text-4xl font-semibold mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                Sign Up Now
            </motion.h2>

            {/* Subhead */}
            <motion.p
                className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                Create an account to start using the dashboard and visualize your EHR data with ease.
            </motion.p>

            {/* Call-to-Action */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block"
            >
                <Link
                    to="/auth"
                    className="bg-white text-blue-600 font-medium py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition"
                >
                    Register Now
                </Link>
            </motion.div>
        </div>
    </motion.section>
);

export default SignUpSection;
