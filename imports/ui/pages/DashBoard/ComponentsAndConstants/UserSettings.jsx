import React, { useEffect, useState } from "react";
import { USER_INFO } from './dashBoardData';
import { getAuthUrl } from "../../../../api/FitBit/auth";

const UserSettings = () => {
    const [settings, setSettings] = useState({
        firstName: USER_INFO.name.firstName,
        lastName: USER_INFO.name.lastName,
        email: USER_INFO.email.value,
        currentPassword: "",
        newPassword: "",
    });

    const [fitBitUrl, setFitBitUrl] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Settings updated successfully!");
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (!settings.currentPassword || !settings.newPassword) {
            alert("Please fill out both password fields.");
            return;
        }
        alert("Password updated successfully!");
        setSettings((prevSettings) => ({
            ...prevSettings,
            currentPassword: "",
            newPassword: "",
        }));
    };

    const linkFitBit = (e) => {
        e.preventDefault();
        window.location.href = fitBitUrl;
    }

    useEffect(() => {
        const getLink = async () => {
            setFitBitUrl(await getAuthUrl());
        }

        getLink();
    }, [])

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">User Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={settings.firstName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={settings.lastName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={settings.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Save Settings
                </button>
            </form>

            {/* Change Password Section */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={settings.currentPassword}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={settings.newPassword}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700">
                        Change Password
                    </button>
                    <footer>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" onClick={linkFitBit}>
                            Link FitBit Account 
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default UserSettings;
