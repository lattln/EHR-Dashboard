import React from 'react';
import { IconHome, IconFlask, IconUser, IconSetting } from '../../svgLibrary';

export const NAV_LINKS = [
    {
        name: 'Home',
        route: '/dashboard',
        icon: <IconHome className="w-6 h-6 text-primary-content" />
    },
    {
        name: 'Lab History',
        route: '/labsHistory',
        icon: <IconFlask className="w-6 h-6 text-primary-content" />
    },
    {
        name: 'User',
        route: '/userSettings',
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
    phone: {
        label: "Phone Number",
        value: "260-999-9999"
    },
    bio: "N/A Edit",
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
    address: {
        country: "United States",
        cityState: "Fort Wayne, IN",
        postalCode: "46816"
    }
};

export const PLACEHOLDER = {
    chart: "Chart Placeholder",
    placeHolder: "PLACE HOLDER BOX",
};

