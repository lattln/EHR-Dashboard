import React from 'react';

const LabHistory = () => {
    // Example data for lab results
    const labResults = [
        { name: 'Vitamin B-12', value: 550, unit: 'mg/dl', minValue: 200, maxValue: 900 },
        { name: 'HBA1C', value: 5.3, unit: '%', minValue: 4, maxValue: 6 },
        { name: 'Hemoglobin', value: 12.5, unit: 'g/dl', minValue: 12, maxValue: 18 },
        { name: 'Vitamin D', value: 50, unit: 'ng/ml', minValue: 30, maxValue: 100 },
        { name: 'TSH', value: 7, unit: 'uU/ml', minValue: 0.4, maxValue: 4.5 }
    ];


    const calculateProgress = (value, maxValue) => {
        const percentage = (value / maxValue) * 100;
        return Math.min(percentage, 100);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 p-6 bg-white">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Lab Results</h2>
                    <span className="text-sm text-gray-500">2x / year | high priority</span>
                </header>

                <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
                    <h3 className="text-xl font-bold">Baseline Test</h3>
                    <p className="text-gray-700 mt-2">....insert </p>
                    <p className="text-gray-500 text-sm mt-2">....insert </p>
                </div>

                {/* Lab Results */}
                <div className="space-y-6">
                    {labResults.map((result, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{result.name}</p>
                                <p className="font-semibold">{result.value} {result.unit}</p>
                            </div>

                            {/* Full-width progress bar */}
                            <div className="mt-2 w-full bg-gray-300 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${calculateProgress(result.value, result.maxValue)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span>{result.minValue} {result.unit}</span>
                                <span>{result.maxValue} {result.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Download Button */}
                <div className="my-6 flex justify-end">
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600">
                        Download Results
                    </button>
                </div>

                {/* Recommended Supplements & Prescriptions */}
                <div className="my-6">
                    <h3 className="text-lg font-semibold">Recommended Supplements & Prescriptions</h3>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
                        <p className="text-gray-700">Based on your test results, consider the following recommendations:</p>
                        <ul className="list-disc pl-6 mt-2">
                            <li>Vitamin B-12 supplement</li>
                            <li>Iron supplement for Hemoglobin levels</li>
                            <li>Vitamin D3 supplement</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabHistory;
