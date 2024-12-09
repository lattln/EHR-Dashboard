import React from 'react';
import Header from '../components/DashBoard/Header';
import { PLACEHOLDER, USER_INFO } from '../constants/dashBoard';


const DashBoard = () => {
    return (
        <div className="flex ml-24 min-h-screen bg-base-200">

            <div className="flex flex-col flex-1">

                <Header />


                <div className="p-6 space-y-6 overflow-y-auto">

                    <div className="grid grid-cols-3 gap-6 bg-primary rounded-lg">
                        <div className=" text-primary-content p-4">
                            <p>{USER_INFO.name.label}: {USER_INFO.name.firstName} {USER_INFO.name.lastName}</p>
                            <p>{USER_INFO.birth.label}: {USER_INFO.birth.value}</p>
                        </div>
                        <div className=" text-primary-content p-4">
                            <p>{USER_INFO.physician.label}: {USER_INFO.physician.value}</p>
                            <p>{USER_INFO.gender.label}: {USER_INFO.gender.value}</p>
                        </div>
                        <div className=" text-primary-content p-4">
                            <p>{USER_INFO.lastAppt.label}: {USER_INFO.lastAppt.value}</p>
                        </div>


                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="bg-base-100 p-6 rounded-lg shadow h-60">
                            <p>{PLACEHOLDER.chart}</p>
                        </div>

                        {Array.from({ length: 10 }).map((_, index) => (
                            <div className="bg-base-100 p-6 rounded-lg shadow h-60" key={index}>
                                <p>
                                    {PLACEHOLDER.placeHolder}
                                </p>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
