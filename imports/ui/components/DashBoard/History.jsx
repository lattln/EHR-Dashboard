import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const History = ({ patientId }) => {
    const [labResults, setLabResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabResults = async () => {
            try {
                const response = await fetch(`/api/fhir/labs?patientId=${patientId}`);
                const data = await response.json();
                setLabResults(data);
            } catch (error) {
                console.error("Error fetching lab results", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLabResults();
    }, [patientId]);

    if (loading) return <p className="text-primary">Loading lab history...</p>;

    return (
        <div className="flex">
            {/* SideNavBar Placeholder */}
            <div className="w-24 h-screen bg-primary hidden lg:block"></div>
            
            <div className="p-6 flex-1">
                <h2 className="text-2xl font-bold mb-4 text-primary">Lab History</h2>
                <div className="bg-neutral shadow-md rounded-lg p-4">
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-primary-content">Patient Lab Summary</h3>
                            <button className="btn btn-primary">Download Report</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {labResults.map((result) => (
                                <motion.div
                                    key={result.id}
                                    className="p-4 bg-neutral-content rounded-xl shadow-md border"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h4 className="font-medium text-primary">{result.testName}</h4>
                                    <p className="text-xl font-bold text-primary">{result.value} {result.unit}</p>
                                    <div className="text-sm text-secondary-content">
                                        {result.date} | {result.status}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-primary">Lab Trends</h3>
                    <div className="bg-neutral shadow-md rounded-lg p-4">
                        <div className="p-4">
                            <Line
                                data={{
                                    labels: labResults.map((res) => res.date),
                                    datasets: [
                                        {
                                            label: "Lab Values Over Time",
                                            data: labResults.map((res) => res.value),
                                            borderColor: "#2563EB",
                                            tension: 0.4,
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
