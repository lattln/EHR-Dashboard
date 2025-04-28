import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconEmail, IconLock, IconLockRepeat, IconUser } from "../../svgLibrary";
import { UserRoles } from '../../../../api/User/userRoles';

const Register = ({ toggleAuth }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState("");
    const [role, setRole] = useState(0);
    const [error, setError] = useState("");
    const [first, setFirst] = useState("")
    const [last, setLast] = useState("")
    const [dob, setDOB] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    const handlePhoneChange = (phoneNumber) => {
        if (phoneNumber.length > 4 && phoneNumber[3] != '-') {
            phoneNumber = phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3);
        }

        if (phoneNumber.length > 7 && phoneNumber[7] != '-') {
            phoneNumber = phoneNumber.substring(0, 7) + '-' + phoneNumber.substring(7);
        }

        if (phoneNumber.length > 12) {
            phoneNumber = phoneNumber.substring(0, 12);
        }

        setPhone(phoneNumber);
    }

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!email || !password || !role) {
            setError("All fields are required. Please fill in your email, username, password, and role.");
            return;
        }
        if (password !== passwordMatch) {
            setError("Passwords must match.");
            return;
        }

        if (!phone.match(/^\d{3}-\d{3}-\d{4}$/) && role == 'Patient') {
            setError("Phone number must be in 123-456-7891 format.");
        }

        if (role === 'patient') {
            let userData = {
                email: email,
                firstName: first,
                phoneNumber: phone,
                lastName: last,
                dob: dob,
                password: password,
                role: role
            }

            console.log(userData)

            try {
                let result = await Meteor.callAsync("user.signup", userData);
                Meteor.loginWithPassword(email, password, (err) => {
                    if (err) {
                        setError(err.reason);
                        console.log(error);
                    } else {
                        setError("");
                        navigate("/patient/home");
                    }
                });
            } catch (e) {
                console.log(e);
            }

        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-8 py-8 sm:px-6 sm:py-10 bg-white rounded-lg shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <form onSubmit={handleSignUp} className="space-y-4">
                {/* Email */}
                <div className="relative">
                    <IconEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Password */}
                <div className="relative">
                    <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Repeat Password */}
                <div className="relative">
                    <IconLockRepeat className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        value={passwordMatch}
                        onChange={(e) => setPasswordMatch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Patient-only fields */}
                {role === UserRoles.PATIENT && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="First Name"
                                value={first}
                                onChange={(e) => setFirst(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="relative">
                            <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={last}
                                onChange={(e) => setLast(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="relative sm:col-span-2">
                            <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="123-456-7891"
                                value={phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="relative sm:col-span-2">
                            <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDOB(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Role selection */}
                <div>
                    <p className="text-gray-700 text-sm font-medium mb-2">
                        Select Your Role
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole(UserRoles.CLINICIAN)}
                            className={`py-2 rounded-lg font-medium transition ${role === UserRoles.CLINICIAN
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-400 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Clinician
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole(UserRoles.PATIENT)}
                            className={`py-2 rounded-lg font-medium transition ${role === UserRoles.PATIENT
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-400 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Patient
                        </button>
                    </div>
                </div>

                {/* Sign Up */}
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Sign Up
                </motion.button>
            </form>

            {/* Toggle to Login */}
            <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-sm text-gray-600"
            >
                Already have an account?{" "}
                <button onClick={toggleAuth} className="text-blue-600 hover:underline">
                    Log In
                </button>
            </motion.p>
        </div>
    );
};

export default Register;
