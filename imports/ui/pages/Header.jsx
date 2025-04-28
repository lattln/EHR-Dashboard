import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { useUser } from "../User";
import { motion, AnimatePresence } from "framer-motion";
import { IconLogOut, IconSetting, IconUser } from "./svgLibrary";

const Header = ({ onMenuClick }) => {
    const { user, userLoading } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const nav = useNavigate();
    const containerRef = useRef(null);

    const handleLogout = (e) => {
        e.preventDefault();
        Meteor.logout((err) => {
            if (err) {
                console.error(err);
                alert("Error logging out");
            } else {
                nav("/");
            }
        });
    };

    // Close dropdown on outside clicks
    useEffect(() => {
        if (!menuOpen) return;

        const onClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", onClickOutside);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center md:justify-end">
            {/* Hamburger for mobile */}
            <button
                className="text-2xl md:hidden"
                onClick={onMenuClick}
                aria-label="Toggle menu"
            >
                ☰
            </button>

            {/* Greeting + avatar + dropdown */}
            <div ref={containerRef} className="flex items-center relative">
                <h3 className="text-lg font-bold text-gray-800">
                    Hi,{" "}
                    {userLoading
                        ? "…"
                        : `${user.profile.firstName} ${user.profile.lastName}`}
                </h3>

                {/* Avatar button */}
                <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="ml-3 focus:outline-none"
                >
                    <img
                        src="/blank.webp"
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute top-full right-0 mt-1 w-40 overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                        >
                            <Link
                                to="/patient/userSettings"
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex gap-2"
                            >
                                <IconUser /> User
                            </Link>
                            <Link
                                to="/patient/settings"
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex gap-2"
                            >
                                <IconSetting /> Settings
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex gap-2"
                            >
                                <IconLogOut /> Log Out
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Header;
