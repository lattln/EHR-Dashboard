import React, { useState } from "react";

const UserSettings = () => {
    // Example state for managing user settings
    const [settings, setSettings] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        currentPassword: "",
        newPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated settings:", settings);
        alert("Settings updated successfully!");
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (!settings.currentPassword || !settings.newPassword) {
            alert("Please fill out both password fields.");
            return;
        }
        console.log("Password change requested:", {
            currentPassword: settings.currentPassword,
            newPassword: settings.newPassword,
        });
        alert("Password updated successfully!");
        setSettings((prevSettings) => ({
            ...prevSettings,
            currentPassword: "",
            newPassword: "",
        }));
    };

    return (
        <div className="ml-28 p-6 bg-base-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">User Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1" htmlFor="firstName">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={settings.firstName}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1" htmlFor="lastName">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={settings.lastName}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={settings.email}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary mt-4"
                >
                    Save Settings
                </button>
            </form>

            {/* Change Password Section */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1" htmlFor="currentPassword">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={settings.currentPassword}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={settings.newPassword}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-secondary"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserSettings;