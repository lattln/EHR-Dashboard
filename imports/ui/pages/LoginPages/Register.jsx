import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IconEmail, IconLock, IconLockRepeat, IconUser } from '../../constants/svgLibrary';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');         // lins job not mine
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        setRole(role);
    };

    const handleSignUp = (e) => {
        e.preventDefault();

        if (!email || !username || !password || !role) {
            setError('All fields are required. Please fill in your email, password, and role.');
            return;
        }
        if (password !== passwordMatch) {
            setError('Password must be the same.');
            return;
        }

        Meteor.call('user.signup', email, password, role, (err) => {
            if (err) {
                setError(error.reason);
            } else {
                setError('');
                alert('Signup successful!');
                navigate('/dashboard');
            }
        })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md bg-base-100">
                <h2 className="text-2xl font-bold text-center text-primary">Register</h2>
                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div className="form-control space-y-1">
                        <div className='relative'>
                            <label className="label">
                                <span className="label-text text-primary">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input input-bordered w-full pl-10"
                                required
                            />
                            <IconEmail className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5"/>
                        </div>

                        <div className='relative'>
                            <label className="label">
                                <span className="label-text text-primary">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input input-bordered w-full pl-10"
                                required
                            />
                            <IconUser className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5"/>
                        </div>

                        <div className='relative'>
                            <label className="label">
                                <span className="label-text text-primary">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input input-bordered w-full pl-10"
                                required
                            />
                            <IconLock className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5"/>
                        </div>

                        <div className='relative'>
                            <label className="label">
                                <span className="label-text text-primary">Repeat-Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={passwordMatch}
                                onChange={(e) => setPasswordMatch(e.target.value)}
                                className="input input-bordered w-full pl-10"
                                required
                            />
                            <IconLockRepeat className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5"/>
                        </div>

                        <div className="form-control space-y-1">
                            <label className="label">
                                <span className="label-text text-primary">Select your role</span>
                            </label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    className={`btn w-1/2 ${
                                        role === 'clinician' ? 'btn-primary' : 'btn-outline'
                                    }`}
                                    onClick={() => handleRoleSelection('clinician')}
                                >
                                    Clinician
                                </button>
                                <button
                                    type="button"
                                    className={`btn w-1/2 ${
                                        role === 'patient' ? 'btn-primary' : 'btn-outline'
                                    }`}
                                    onClick={() => handleRoleSelection('patient')}
                                >
                                    Patient
                                </button>
                            </div>
                        </div>
                        
                        <div className='py-3'>
                            <button type="submit" className="btn btn-primary w-full">
                                Sign up
                            </button>
                        </div>
                    </div>
                </form>
                <p className="text-center text-sm text-secondary">
                    Already have an account?
                    <Link to="/Login" className="text-accent hover:underline px-1">
                        login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
