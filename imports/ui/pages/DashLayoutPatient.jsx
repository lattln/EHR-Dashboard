import React from 'react'
import { Outlet } from 'react-router-dom';
import SideNavBar from './SideNavBar'


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