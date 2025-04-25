import React from 'react';
import { motion } from 'framer-motion';

const SignUpSection = () => {
    return (
        <motion.section
            id="signup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-blue-900 text-white py-16"
        >
            <div className="container mx-auto text-center">
                <motion.h2
                    className="text-3xl font-semibold mb-4"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Sign Up Now
                </motion.h2>
                <p className="text-lg mb-8">Create an account to start using the dashboard and visualize your data.</p>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="bg-orange-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-orange-400 transition duration-300"
                >
                    Register Now
                </motion.button>
            </div>
        </motion.section>
    );
};

export default SignUpSection;
