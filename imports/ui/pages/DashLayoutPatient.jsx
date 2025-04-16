import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavBar from './SideNavBar';
import Header from './Header';

const PatientDashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleMenuClick = () => setIsSidebarOpen((prev) => !prev);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar (hidden on mobile, visible on md+) */}
            <div
                className={`fixed top-0 left-0 z-50 h-full transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } w-60 bg-blue-600 md:relative md:block`}
            >
                <SideNavBar onCloseMobile={() => setIsSidebarOpen(false)} />
            </div>


            {/* Main Content */}
            <div className="flex flex-col flex-1 min-h-screen bg-gray-100">
                {/* Header receives toggle function */}
                <Header onMenuClick={handleMenuClick} />

                {/* Routed content */}
                <main className="overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PatientDashboardLayout;
