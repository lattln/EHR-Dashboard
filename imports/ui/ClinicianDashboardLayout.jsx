import React from 'react'
import { Outlet } from 'react-router-dom';

const ClinicianDashboardLayout = () => (
    <>
        <div className="hidden md:flex">
            {/** <ClinicianSideNavBar /> */}
        </div>

        <div className="ml-0 md:ml-60 ">
            <Outlet />
        </div>
    </>
);

export default ClinicianDashboardLayout