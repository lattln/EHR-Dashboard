import React from 'react'
import SideNavBar from './pages/Dashboard_Patient/ComponentsAndConstants/SideNavBar'
import { Outlet } from 'react-router-dom';

const PatientDashboardLayout = () => (
    <>
        <div className="hidden md:flex">
            <SideNavBar />
        </div>

        <div className="ml-0 md:ml-60 ">
            <Outlet />
        </div>
    </>
);

export default PatientDashboardLayout