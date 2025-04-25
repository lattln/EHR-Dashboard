import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="bg-gray-800 text-white text-center py-8"
        >
            <p>&copy; 2025 EHR Dashboard. All rights reserved.</p>
            <div>
                <a href="#contact" className="hover:text-gray-400">Contact Us</a>
            </div>
        </motion.footer>
    );
};

export default Footer;
