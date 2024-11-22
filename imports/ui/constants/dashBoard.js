import React from 'react';
import { IconHome, IconHistory, IconUser, IconSetting } from './svgLibrary';

export const NAV_LINKS = [
    {
        name: 'Home',
        route: '/',
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

export const USER_INFO =
{
    name:
    {
        label: "Name",
        value: "John Smith"
    },
    gender:
    {
        label: "Gender",
        value: "Male"
    },
    birth:
    {
        label: "Birthday",
        value: "3/12/1987"
    },
    physician:
    {
        label: "Physician",
        value: "Dr. Dre"
    },
    lastAppt:
    {
        label: "Last Appointment",
        value: "10/18/2024"
    }
}
