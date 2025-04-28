import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => (
    <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-t mt-20 py-8"
    >
        <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center text-gray-600">
            <p>&copy; 2025 EHR Dashboard. All rights reserved.</p>
            <a href="#about" className="block mt-2 hover:text-gray-800">Contact Us</a>
        </div>
    </motion.footer>
);

export default Footer;
