import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../User';

const Summary = () => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);
    const { user, userLoading } = useUser();
    useEffect(() => {
        async function fetchSummary() {
            try {
                const id = user.fhirID; 
                console.log(user);
                const result = await Meteor.callAsync('ozwell.getSummary', id, "patient.getSummaryMetrics");
                if (result?.data?.summary) {
                    setSummary(result.data.summary);
                } else {
                    setSummary('<p>No summary available at this time.</p>');
                }
            } catch (error) {
                console.error('Error fetching summary.', error);
                setSummary('<p class="text-red-500">Error fetching summary.</p>');
            } finally {
                setLoading(false);
            }
        }
        
        if(!userLoading){
            fetchSummary();
        }
    }, [userLoading]);

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
                Your AI Summary <span className="ml-2 text-yellow-500 text-lg">✨</span>
            </h2>

            {loading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
            ) : (
                <div
                    className="text-gray-800 leading-relaxed text-[15px]"
                    dangerouslySetInnerHTML={{ __html: summary }}
                />
            )}
        </div>
    );
};

export default Summary;
