import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import DevLanding from "./pages/DevLandingPage/DevLanding";
import AuthPage from "./pages/LoginPages/AuthPage";
import Token from "./pages/Token";

import PatientDashboardLayout from "./PatientDashboardLayout";
import DashBoard from "./pages/Dashboard_Patient/DashBoard";
import NotFound from "./pages/NotFound";
import UserSettings from './pages/Dashboard_Patient/ComponentsAndConstants/UserSettings';
import Settings from "./pages/Dashboard_Patient/ComponentsAndConstants/Settings";
import LabsHistory from "./pages/Dashboard_Patient/ComponentsAndConstants/LabsHistory";

import ClinicianDashboardLayout from "./ClinicianDashboardLayout";
import ClinicianHome from "./pages/Dashboard_Clinician/ClinicianHome";
import PatientRecords from "./pages/Dashboard_Clinician/ComponentsAndConstants/PatientRecords";
import ClinicianSettings from "./pages/Dashboard_Clinician/ComponentsAndConstants/ClinicianSettings";


const router = createBrowserRouter(
    [
        {
            path: "/patient",
            element: <PatientDashboardLayout />,
            children: [
                { index: true, element: <Navigate to="/patient/dashboard" replace /> },
                { path: "home", element: <DashBoard /> },
                { path: "userSettings", element: <UserSettings /> },
                { path: "settings", element: <Settings />},
                { path: "labsHistory", element: <LabsHistory />},
                { path: "*", element: <NotFound />},
                { path: "not-found", element: <NotFound />}
            ],
        },
        {
            path: "/clinician",
            element: <ClinicianDashboardLayout />,
            children: [
                { index: true, element: <ClinicianHome /> },
                { path: "home", element: < ClinicianHome />},
                { path: "patientRecords", element: <PatientRecords /> },
                { path: "clinicianSettings", element: <ClinicianSettings /> },
                { path: "*", element: <NotFound /> },
            ],
        },
        { path: "/auth", element: <AuthPage /> },
        { path: "dev", element: <DevLanding /> },
        { path: "/toke", element: <Token />},
        { path: "*", element: <NotFound /> },
    ],
    {
        //Enable all flags to turn off warning flags from React Router.. thingy..
        future: {
            v7_startTransition: true, // Opt-in to React's startTransition for async rendering
            v7_fetcherPersist: true, // Adjust fetcher persistence behavior
            v7_normalizeFormMethod: true, // Normalize formMethod to uppercase
            v7_partialHydration: true, // Enable partial hydration for server-rendered apps
            v7_skipActionErrorRevalidation: true, // Skip revalidation on 4xx/5xx errors
            v7_relativeSplatPath: true, // Change relative splat path resolution
        },
    }
);

const App = () => {
    return (
        <AnimatePresence>
            <RouterProvider router={router} />;
        </AnimatePresence>
    )
};

export default App;
