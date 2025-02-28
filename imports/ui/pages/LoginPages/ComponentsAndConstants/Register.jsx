import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconEmail, IconLock, IconLockRepeat, IconUser } from "../../svgLibrary";

const Register = ({ toggleAuth }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
    };

    const handleSignUp = (e) => {
        e.preventDefault();

        if (!email || !username || !password || !role) {
            setError("All fields are required. Please fill in your email, username, password, and role.");
            return;
        }
        if (password !== passwordMatch) {
            setError("Passwords must match.");
            return;
        }

        Meteor.call("user.signup", email, password, role, (err) => {
            if (err) {
                setError(err.reason);
            } else {
                setError("");
                alert("Signup successful!");
                navigate("/dashboard");
            }
        });
    };

    return (
        <div className="p-12 space-y-6 rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <form className="space-y-4" onSubmit={handleSignUp}>
                {/* Email Input */}
                <div className="space-y-1">
                    <label className="text-gray-700 text-sm font-medium">Email</label>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
                            required
                        />
                        <IconEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    </div>
                </div>

                {/* Username Input */}
                <div className="space-y-1">
                    <label className="text-gray-700 text-sm font-medium">Username</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
                            required
                        />
                        <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                    <label className="text-gray-700 text-sm font-medium">Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
                            required
                        />
                        <IconLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1">
                    <label className="text-gray-700 text-sm font-medium">Repeat Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Repeat your password"
                            value={passwordMatch}
                            onChange={(e) => setPasswordMatch(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
                            required
                        />
                        <IconLockRepeat className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-1">
                    <label className="text-gray-700 text-sm font-medium">Select Your Role</label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className={`w-1/2 py-2 rounded-lg font-medium transition duration-200 ${role === "clinician"
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-400 text-gray-600 hover:bg-gray-200"
                                }`}
                            onClick={() => handleRoleSelection("clinician")}
                        >
                            Clinician
                        </button>
                        <button
                            type="button"
                            className={`w-1/2 py-2 rounded-lg font-medium transition duration-200 ${role === "patient"
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-400 text-gray-600 hover:bg-gray-200"
                                }`}
                            onClick={() => handleRoleSelection("patient")}
                        >
                            Patient
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Sign up
                </motion.button>
            </form>

            {/* Toggle Between Login & Register */}
            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-sm text-gray-600"
            >
                Already have an account?{" "}
                <button
                    onClick={toggleAuth}
                    className="text-blue-600 hover:underline px-1"
                >
                    Login
                </button>
            </motion.p>
        </div>
    );
};

export default Register;
