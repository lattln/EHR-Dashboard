import React from 'react';
import { IconLock, IconUser, IconLockRepeat, IconEmail } from './svgLibrary';


//Test File --> Maybe we can use this? --> Scalability

export const REGISTER_PAGE = [
    {
        text: "Email",
        type: "email",
        placeholder: "Enter your email",
        icon: <IconEmail className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5" />
    },
    {
        text: "Username",
        type: "text",
        placeholder: "Enter your username",
        icon: <IconUser className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5" />
    },
    {
        text: "Password",
        type: "password",
        placeholder: "Enter your password",
        icon: <IconLock className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5" />
    },
    {
        text: "Repeat-Password",
        type: "password",
        placeholder: "Re-Enter your password",
        icon: <IconLockRepeat className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5" />
    }
]

export const LOGIN_PAGE = [
    {
        text: "Email",
        type: "email",
        placeholder: "Enter your email",
        icon: <IconEmail className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5" />
    },
    {
        text: "Password",
        type: "password",
        placeholder: "Enter your password",
        icon: <IconLock className="absolute left-3 top-[60%] transform -translate-y-0 text-gray-500 w-5 h-5" />
    },
]

const TEST_SCALEABLE_RENDER = () => (
    <div>
        {LOGIN_PAGE.map((inputSection) => (
            <div className='relative'>
                <label className='label'>
                    <span className='label-text text-primary'>
                        {inputSection.text}
                    </span>
                </label>

                <input
                    type={inputSection.type}
                    placeholder={inputSection.placeholder}
                    className='input input-bordered w-full pl-10'
                    required
                />
                {inputSection.icon}
            </div>
        ))}
    </div>
)