import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';

const Summary = () => {
    const [summary, setSummary] = useState('');

    useEffect(() => {
        async function fetchSummary() {
            try {
                const patientID = 1
                const result = await Meteor.callAsync('ozwell.getSummary', patientID);

                if (result && result.data && result.data.summary) {
                    setSummary(result.data.summary);
                }
            } catch (error) {
                console.error('Error fetching summary.', error);
                setSummary('Error fetching summary.');
            }
        }

        fetchSummary();
    }, []);

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
                Your AI Summary 
                <span className="ml-2 text-yellow-500 text-lg">✨</span>
            </h2>
            <div
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: summary }}
            />
        </div>
    );
};

export default Summary;