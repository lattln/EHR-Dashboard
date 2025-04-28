import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meteor } from "meteor/meteor";
import { useUser } from "../../../User";

const LabsResult = ({
    isOpen,
    onClose,
    selectedLab,
    inline = false,
    className = "",
}) => {
    if (!isOpen || !selectedLab) return null;
    const user = useUser();
    const [summary, setSummary] = useState("");

    useEffect(() => {
        if (!inline && isOpen && selectedLab && user?.id) {
            Meteor.callAsync("ozwell.getSummary", user.id, "patient.getLabSummary")
                .then((res) => {
                    if (res?.status === "success" && res.data?.summary) {
                        setSummary(res.data.summary);
                    }
                })
                .catch(console.error);
        }
    }, [inline, isOpen, selectedLab, user]);

    const calculateProgress = (value) => {
        if (typeof value !== "number" || value < 0) return 0;
        return Math.min(value, 100);
    };

    const Content = (
        <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
            <h3 className="text-2xl font-bold mb-2">Lab Report Details</h3>
            <p className="text-sm text-gray-500 mb-4">
                <strong>{selectedLab.loincText}</strong> —{" "}
                {new Date(selectedLab.dateIssued).toLocaleDateString()}
            </p>

            <div className="space-y-4">
                {selectedLab.observations.map((obs, idx) => {
                    const vq = obs.valueQuantities?.[0] || {};
                    const val = vq.value ?? 0;
                    const unit = vq.unit || "";
                    return (
                        <div key={idx} className="bg-gray-100 p-4 rounded-lg">
                            <p className="font-semibold">{obs.loincText}</p>
                            <p className="text-sm text-gray-700 mb-2">
                                {val} {unit}
                            </p>
                            <motion.div
                                className="w-full bg-gray-300 rounded-full h-2 overflow-hidden"
                                initial={{ width: 0 }}
                                animate={{ width: `${calculateProgress(val)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <div className="bg-blue-500 h-2 rounded-full" />
                            </motion.div>
                        </div>
                    );
                })}

                {!inline && summary && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p
                            className="text-sm text-gray-800"
                        />
                        {summary}
                    </div>
                )}
            </div>

            {!inline && (
                <div className="mt-6 flex justify-center">
                    <motion.button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                    >
                        Close Lab Report
                    </motion.button>
                </div>
            )}
        </div>
    );


    if (inline) return Content;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative max-w-3xl w-full max-h-[90vh] overflow-auto"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                        {Content}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LabsResult;
