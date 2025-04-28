import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../User";

const UserSettings = () => {
    const { user, userLoading } = useUser();
    const nav = useNavigate();

    useEffect(() => {
        if (Meteor.userId() == null) {
            nav('/auth');
        }
    }, [])

    const logout = (e) => {
        e.preventDefault();
        Meteor.logout((err) => {
            if (err) {
                console.log(err);
                alert("Error loggin out");
            } else {
                nav("/auth");
            }
        })
    }

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };


    return (
        <motion.div
            className="p-5 h-screen bg-gray-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >

            {/* Profile Section */}
            <motion.div
                className=""
                variants={itemVariants}
            >
                <div className="flex justify-between items-center mb-4 p-8 rounded-lg shadow-md bg-white">
                    <div>
                        <img src="/blank.webp" alt="Profile" className="rounded-full w-16 h-16 mr-4" />
                        <div>
                            <h2 className="text-2xl font-semibold">{userLoading ? "..." : user.profile.firstName + " " + user.profile.lastName}</h2>
                        </div>
                    </div>

                    <button onClick={logout} className="w-fit bg-blue-600 text-white mt-4 p-2 rounded-lg hover:bg-blue-700">
                        Log Out
                    </button>
                </div>
            </motion.div>

            {/* Personal Information Section */}
            <motion.div
                className=""
                variants={itemVariants}
            >
                <div className="p-8 rounded-lg shadow-md bg-white">
                    <div className="flex justify-end">
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block font-medium mb-1">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={userLoading ? "..." : user.profile.firstName}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled="true"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={userLoading ? "..." : user.profile.lastName}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled="true"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block font-medium mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={userLoading ? "..." : user.emails[0].address}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block font-medium mb-1">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={userLoading ? "..." : user.profile.phoneNumber}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled="true"
                            />
                        </div>

                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserSettings;
