import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../../User';
import LabsResult from './LabsResult';
import ThreeDotsWave from '../../three-dots-wave'

const LabHistory = () => {
    const { userLoading, user, id } = useUser();
    const [labResults, setLabResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLab, setSelectedLab] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (userLoading || !user) {
            return;
        }
        const fetchLabResults = async () => {
            try {
                Meteor.call('patient.getRecentLabs', id, 1, 100, (err, res) => {
                    if (err) {
                        setError(err.message);
                        setLoading(false);
                    } else {
                        setLabResults(res);
                        setLoading(false);
                    }
                });
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchLabResults();
    }, [userLoading, user, id]);

    const handleLabClick = (lab) => {
        setSelectedLab(lab);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <div className="flex-1 p-6 bg-white">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Lab Results</h2>
                    </header>
                    {/* Loading Spinner for Lab Report List */}
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ThreeDotsWave size="1rem" />
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 p-6 bg-white">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Lab Results</h2>
                </header>

                {/* Display Lab Reports List */}
                <div className="space-y-6">
                    {labResults.map((result, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            onClick={() => handleLabClick(result)}
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{result.loincText}</p>
                                <p className="font-semibold">{new Date(result.dateIssued).toLocaleDateString()}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal for showing the selected Lab Report details */}
            <LabsResult
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                selectedLab={selectedLab}
            />
        </div>
    );
};

export default LabHistory;
