import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavBar from './components/DashBoard/SideNavBar'


const Layout = () => {
    return (
        <div className='flex'>
            <SideNavBar />

            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
