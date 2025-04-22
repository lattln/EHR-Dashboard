import React from 'react';
import { motion } from 'framer-motion';

const LabsResult = ({ isOpen, onClose, selectedLab }) => {
    if (!isOpen || !selectedLab) return null; 

    const calculateProgress = (value) => {

        if (typeof value !== 'number' || value < 0) return 0; 
        return Math.min(value, 100);  
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            onClick={onClose} // Close modal when clicking outside
        >
            <motion.div
                className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative overflow-y-auto max-h-[90vh] sm:max-w-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-60"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h3 className="text-2xl font-bold mb-4">Lab Report Details</h3>
                <p className="text-lg font-semibold">{selectedLab.loincText}</p>
                <p className="text-sm text-gray-500 mb-4">
                    Date Issued: {new Date(selectedLab.dateIssued).toLocaleDateString()}
                </p>

                {/* List Observations */}
                <div className="space-y-4">
                    {selectedLab.observations.map((obs, index) => (
                        <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <p className="font-semibold">{obs.loincText}</p>
                            
                            {/* Access valueQuantities array */}
                            {obs.valueQuantities && obs.valueQuantities.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Value: {obs.valueQuantities[0].value} {obs.valueQuantities[0].unit}
                                    </p>
                                    
                                    {/* Progress Bar Animation */}
                                    <motion.div
                                        className="mt-2 w-full bg-gray-300 rounded-full h-2"
                                        initial={{ width: '0%' }}
                                        animate={{
                                            width: `${calculateProgress(obs.valueQuantities[0].value)}%`,  
                                        }}
                                        transition={{
                                            duration: 1,
                                            ease: 'easeOut', 
                                        }} 
                                    >
                                        <div className="bg-blue-500 h-2 rounded-full"></div>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className='space-y-4'>
                        Noah Shit summary here.
                    </div>
                </div>

                {/* Download Button */}
                <div className="my-6 flex justify-end">
                    <motion.button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Download Results
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default LabsResult;
