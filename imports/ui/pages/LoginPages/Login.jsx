import React from 'react';
import { Link } from 'react-router-dom';
import { IconEmail, IconLock } from '../../constants/svgLibrary';

const Login = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md bg-base-100">
                <h2 className="text-2xl font-bold text-center text-primary">Login</h2>
                <form className="space-y-4">

                    <div className="form-control space-y-1">
                        <div className="relative">
                            <label className="label">
                                <span className="label-text text-primary">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full pl-10"
                                required
                            />
                            <IconEmail className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5"/>

                        </div>

                        <div className='relative'>
                            <label className="label">
                                <span className="label-text text-primary">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full pl-10"
                                required
                            />
                            <IconLock className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5"/>
                        </div>

                        <div className="flex justify-between items-center">
                            <label className="label">

                                <input type="checkbox" className="checkbox checkbox-accent" />
                                <span className="label-text-alt text-sm text-secondary ml-2">
                                    remember-me
                                </span>
                            </label>
                            <a href="NONE" className="text-sm text-secondary hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" className="btn btn-primary w-full">
                            Login
                        </button>

                    </div>
                </form>

                <p className="text-center text-sm text-secondary">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-accent hover:underline px-1">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
