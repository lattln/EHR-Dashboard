import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconEmail, IconLock } from "../../svgLibrary";

const Login = ({ toggleAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("rememberedEmail");
        if (saved) {
            setEmail(saved);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }
    }, [email, rememberMe]);

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
        <div className="w-full max-w-md mx-auto px-8 py-8 sm:px-6 sm:py-10 bg-white rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <form className="space-y-4" onSubmit={handleLogin}>
                {/* Email Input */}
                <div className="relative">
                    <IconEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                {/* Password Input */}
                <div className="relative">
                    <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                {/* Remember Me */}
                <div className="flex items-center text-sm">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="accent-blue-600"
                        />
                        <span className="text-gray-600">Remember me</span>
                    </label>
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
                <button onClick={toggleAuth} className="text-blue-600 hover:underline">
                    Sign up
                </button>
            </motion.p>
        </div>
    );
};

export default Login;
