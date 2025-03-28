import React, { useState } from "react";
import { motion } from "framer-motion";
import { USER_INFO } from '../../Constants';

const UserSettings = () => {
    const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
    const [settings, setSettings] = useState({
        firstName: USER_INFO.name.firstName,
        lastName: USER_INFO.name.lastName,
        email: USER_INFO.email.value,
        phone: USER_INFO.phone.value,
        bio: USER_INFO.bio,
        country: USER_INFO.address.country,
        cityState: USER_INFO.address.cityState,
        postalCode: USER_INFO.address.postalCode,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true); // Enable editing mode
    };

    const handleSaveClick = () => {
        setIsEditing(false); // Disable editing mode and "save" changes
        alert("Settings updated successfully!");
    };



    return (
        <div className="p-5 h-screen bg-gray-100">
            {/* Profile Section */}

            <motion.div
            className=""
            initial={{opacity: 0, y:-40}}
            animate={{opacity: 1, y:0}}
            transition={{duration: 0.6}}
            >
            <div className="flex items-center mb-4 p-8 rounded-lg shadow-md bg-white">
                <img src="/blank.webp" alt="Profile" className="rounded-full w-16 h-16 mr-4" />
                <div>
                    <h2 className="text-2xl font-semibold">{settings.firstName} {settings.lastName}</h2>
                    <p className="text-sm text-gray-500">{settings.bio}</p>
                    <p className="text-sm text-gray-500">{USER_INFO.location}</p>
                </div>

            </div>
            </motion.div>

            {/* Personal Information Section */}
            <motion.div
                className=""
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >


                <div className="p-8 rounded-lg shadow-md bg-white">
                    <div className="flex justify-end">
                        <button
                            onClick={handleEditClick}
                            className="ml-auto text-blue-600 hover:underline"
                        >
                            {isEditing ? "Editing..." : "Edit"}
                        </button>
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
                                    value={settings.firstName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!isEditing} // Disable input if not in editing mode
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={settings.lastName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block font-medium mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={settings.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block font-medium mb-1">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={settings.phone}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Save button only shows when editing */}
                    </form>


                    {/* Address Section */}
                    <h3 className="text-xl font-semibold mt-4 mb-4">Address</h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="country" className="block font-medium mb-1">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={settings.country}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label htmlFor="cityState" className="block font-medium mb-1">City/State</label>
                                <input
                                    type="text"
                                    id="cityState"
                                    name="cityState"
                                    value={settings.cityState}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="postalCode" className="block font-medium mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={settings.postalCode}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </form>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleSaveClick}
                            className="w-full bg-blue-600 text-white mt-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default UserSettings;
