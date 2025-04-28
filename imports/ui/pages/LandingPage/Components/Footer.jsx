import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => (
    <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white py-3"
    >
        <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center text-gray-800 flex justify-center">
            <p>&copy; 2025 HealthBridge. All rights reserved.</p>
        </div>
    </motion.footer>
);

export default Footer;
