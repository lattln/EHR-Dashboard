import React from 'react';
import { IconHome, IconFlask, IconUser, IconSetting, IconPatients, IconTasks } from './svgLibrary';

export const SIDEBAR_DATA_PATIENT = [
    {
        name: 'Home',
        route: 'home',
        icon: <IconHome className="w-6 h-6" />
    },
    {
        name: 'Lab History',
        route: 'labsHistory',
        icon: <IconFlask className="w-6 h-6" />
    },
    {
        name: 'User',
        route: 'userSettings',
        icon: <IconUser className="w-6 h-6" />
    },
    {
        name: 'Settings',
        route: 'settings',
        icon: <IconSetting className="w-6 h-6" />
    },
];

export const SIDEBAR_DATA_CLINICIAN = [
    {
        name: 'Home',
        route: 'home',
        icon: <IconHome className="w-6 h-6" />
    },
    {
        name: "PatientList",
        route: "patientList",
        icon: <IconPatients className="w-6 h-6" />
    },
    {
        name: "Tasks", 
        route: "tasks",
        icon: <IconTasks className="w-6 h-6" />

    }
]

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

export const NOTFOUND = 
{
    error404: "404",
    l1: `Something's missing`,
    l2: `Sorry, We have not implented that page or we can't find that page. You'll find lots to explore on the home page`,
    textBtn: 'Back to Homepage' 
}
