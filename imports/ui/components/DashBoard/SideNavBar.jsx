import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../constants/dashBoard'

const SideNavBar = () => {
    return (
        <div>
            <div className="fixed hidden h-screen w-24 bg-primary shadow-lg lg:flex flex-col items-center py-4 space-y-7">
                {/* Logo */}
                <div className="mb-6">
                    <Link to="/dev">
                        <div className="w-12 h-12 bg-primary-content rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">LOGO</span>
                        </div>
                    </Link>
                </div>

                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.name}
                        to={link.route}
                        className="tooltip tooltip-right"
                        data-tip={link.name}
                    >
                        {link.icon}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SideNavBar;
