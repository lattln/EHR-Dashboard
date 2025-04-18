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

    const handleRoleSelection = (selectedRole) => {
        if(selectedRole = 0){
            setRole(UserRoles.CLINICIAN);
        } else if(selectedRole = 1){
            setRole(UserRoles.PATIENT);
        }
    };

    const handlePhoneChange = (phoneNumber) => {
        if(phoneNumber.length > 4 && phoneNumber[3] != '-'){
            phoneNumber = phoneNumber.substring(0, 3) + '-' + phoneNumber.substring(3);
        }

        if(phoneNumber.length > 7 && phoneNumber[7] != '-'){
            phoneNumber = phoneNumber.substring(0, 7) + '-' + phoneNumber.substring(7);
        }

        if(phoneNumber.length > 12){
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

        if(!phone.match(/^\d{3}-\d{3}-\d{4}$/) && role == 'Patient'){
            setError("Phone number must be in 123-456-7891 format.");
        }

        if(role === 'patient'){
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
                console.log(result);
            } catch (e) {
                console.log(e);
            }

        }
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

                {/* Extra patient information */}
                <div className="space-y-1">
                    <div className="flex gap-4">
                        <div>
                            <label className="text-gray-700 text-sm font-medium">First</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={first}
                                    onChange={(e) => setFirst(e.target.value)}
                                    className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
                                    required
                                />
                                <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <label className="text-gray-700 text-sm font-medium">Last</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={last}
                                    onChange={(e) => setLast(e.target.value)}
                                    className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
                                    required
                                />
                                <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <label className="space-y-1 text-gray-700 text-sm font-medium">Phone Number</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="123-456-7891"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
                            required
                        />
                        <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    </div>
                    
                    <label className="space-y-1 text-gray-700 text-sm font-medium">Date of Birth</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDOB(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
                            required
                        />
                        <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
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
                            onClick={() => handleRoleSelection(0)}
                        >
                            Clinician
                        </button>
                        <button
                            type="button"
                            className={`w-1/2 py-2 rounded-lg font-medium transition duration-200 ${role === "patient"
                                    ? "bg-blue-600 text-white"
                                    : "border border-gray-400 text-gray-600 hover:bg-gray-200"
                                }`}
                            onClick={() => handleRoleSelection(1)}
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
