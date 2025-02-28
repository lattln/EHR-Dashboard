import React from 'react';
import { IconHome, IconHistory, IconUser, IconSetting } from './svgLibrary';

export const NAV_LINKS = [
    {
        name: 'Home',
        route: '/dashboard',
        icon: <IconHome className="w-6 h-6 text-primary-content" />
    },
    {
        name: 'History',
        route: '/history',
        icon: <IconHistory className="w-6 h-6 text-primary-content" />
    },
    {
        name: 'User',
        route: '/user',
        icon: <IconUser className="w-6 h-6 text-primary-content" />
    },
    {
        name: 'Settings',
        route: '/settings',
        icon: <IconSetting className="w-6 h-6 text-primary-content" />
    },
];

export const USER_INFO = {
    name: {
        label: "Name",
        firstName: "John",
        lastName: "Smith",
    },
    email: {
        label: "Email",
        value: "johnsmith@example.com",
    },
    gender: {
        label: "Gender",
        value: "Male",
    },
    birth: {
        label: "Birthday",
        value: "3/12/1987",
    },
    physician: {
        label: "Physician",
        value: "Dr. Dre",
    },
    lastAppt: {
        label: "Last Appointment",
        value: "10/18/2024",
    },
    weight: {
        label: "Weight (lbs)",
        value: "174"
    },
    height: {
        label: "Height (in.)",
        value: "70"
    }
};

export const PLACEHOLDER = {
    chart: "Chart Placeholder",
    placeHolder: "PLACE HOLDER BOX",
};
