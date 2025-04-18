import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconEmail, IconLock } from "../../svgLibrary";

const Login = ({ toggleAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        Meteor.loginWithPassword(email, password, (err) => {
            if (err) {
                setError(err.reason);
            } else {
                setError("");
                navigate("/patient/home");
            }
        });
    };

    return (
        <div className="p-12 space-y-6  rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <form className="space-y-4" onSubmit={handleLogin}>
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

                {/* Remember Me & Forgot Password */}
                <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="accent-blue-600" />
                        <span className="text-gray-600">Remember me</span>
                    </label>
                    {/* Forgot Password */}
                    {/* <a href="#" className="text-blue-600 hover:underline">Forgot password?</a> */}
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Login
                </motion.button>
            </form>

            {/* Toggle Between Login & Register */}
            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-sm text-gray-600"
            >
                Don't have an account?{" "}
                <button
                    onClick={toggleAuth}
                    className="text-blue-600 hover:underline px-1"
                >
                    Sign up
                </button>
            </motion.p>
        </div>
    );
};

export default Login;
