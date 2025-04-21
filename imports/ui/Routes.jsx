import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DevLanding from "./pages/DevLandingPage/DevLanding";
import AuthPage from "./pages/LoginPages/AuthPage";
import Token from "./pages/Token";

import PatientDashboardLayout from "./pages/DashLayoutPatient";
import DashBoard from "./pages/DashboardPatient/DashBoard";
import NotFound from "./pages/NotFound";
import UserSettings from './pages/DashboardPatient/Components/UserSettings';
import Settings from "./pages/DashboardPatient/Components/Settings";
import LabsHistory from "./pages/DashboardPatient/Components/LabsHistory";

import ClinicianDashboardLayout from "./pages/DashLayoutClinician";
import ClinicianHome from "./pages/DashboardClinician/ClinicianHome";
import PatientRecords from "./pages/DashboardClinician/Components/PatientRecords";
import ClinicianSettings from "./pages/DashboardClinician/Components/ClinicianSettings";

const Routes = () => {
    const router = createBrowserRouter(
        [
            {
                path: "/patient",
                element: <PatientDashboardLayout />,
                children: [
                    { index: true, element: <Navigate to="/patient/home" replace /> },
                    { path: "home", element: <DashBoard /> },
                    { path: "userSettings", element: <UserSettings /> },
                    { path: "settings", element: <Settings />},
                    { path: "labsHistory", element: <LabsHistory />},
                    { path: "*", element: <NotFound />},
                    { path: "not-found", element: <NotFound /> }
                ],
            },
            {
                path: "/clinician",
                element: <ClinicianDashboardLayout />,
                children: [
                    { index: true, element: <ClinicianHome to="/clinician/home" /> },
                    { path: "home", element: <ClinicianHome />},
                    { path: "patientRecords", element: <PatientRecords /> },
                    { path: "clinicianSettings", element: <ClinicianSettings /> },
                    { path: "*", element: <NotFound /> },
                ],
            },

            { path: "/", element: <AuthPage /> },
            { path: "dev", element: <DevLanding /> },
            { path: "/toke", element: <Token />},
            { path: "*", element: <NotFound /> },
        ],
        {
            // Enable all flags to turn off warning flags from React Router
            future: {
                v7_startTransition: true,
                v7_fetcherPersist: true,
                v7_normalizeFormMethod: true,
                v7_partialHydration: true,
                v7_skipActionErrorRevalidation: true,
                v7_relativeSplatPath: true,
            },
        }
    );

    return <RouterProvider router={router} />;
};

export default Routes;
