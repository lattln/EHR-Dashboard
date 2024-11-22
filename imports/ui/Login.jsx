import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export const Login = () => {
    const [isSignup, setIsSignup] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        
        if (!email || !password || !role) {
            setError('All fields are required. Please fill in your email, password, and role.');
            return;
        }

        Meteor.call('users.signup', email, password, role, (err) => {
            if (err) {
                setError(error.reason);
            } else {
                setError('');
                alert('Signup successful!');

                // ADD HOME PAGE ROUTING HERE

            }
        });
    };

    const handleLogin = () => {
        Meteor.loginWithPassword(email, password, (err) => {
            if (err) {
                setError(err.reason);
            } else {
                setError('');
                alert('Login successful!');

                // ADD HOME PAGE ROUTING HERE

            }
        });
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-8 bg-white shadow-md rounded-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {isSignup ? 'Signup' : 'Login'}
                </h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {isSignup && (
                    <div className="flex justify-between mb-4">
                        <button
                            type="button"
                            onClick={() => setRole('clinician')}
                            className={`w-1/2 p-3 mx-1 border rounded-md font-semibold ${
                                role === 'clinician'
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                            }`}
                        >
                            Clinician
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('patient')}
                            className={`w-1/2 p-3 mx-1 border rounded-md font-semibold ${
                                role === 'patient'
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                            }`}
                        >
                            Patient
                        </button>
                    </div>
                )}

                <button
                    onClick={isSignup ? handleSignUp : handleLogin}
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
                >
                    {isSignup ? 'Sign Up' : 'Log In'}
                </button>

                <p className="mt-4 text-center text-gray-600">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <span
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-blue-500 font-semibold cursor-pointer hover:underline"
                    >
                        {isSignup ? 'Log In' : 'Sign Up'}
                    </span>
                </p>

                {error && (
                    <p className="mt-4 text-red-500 text-center font-medium">
                        {error}
                    </p>
                )}
            </div>
        </div>

    );
};
