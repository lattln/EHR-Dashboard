import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DevLanding from "./pages/DevLandingPage/DevLanding";
import AuthPage from "./pages/LoginPages/AuthPage";
import Token from "./pages/Token";

import PatientDashboardLayout from "./pages/DashLayoutPatient";
import DashBoard from "./pages/Dashboard_Patient/DashBoard";
import NotFound from "./pages/NotFound";
import UserSettings from './pages/Dashboard_Patient/Components/UserSettings';
import Settings from "./pages/Dashboard_Patient/Components/Settings";
import LabsHistory from "./pages/Dashboard_Patient/Components/LabsHistory";

import ClinicianDashboardLayout from "./pages/DashLayoutClinician";
import ClinicianHome from "./pages/Dashboard_Clinician/ClinicianHome";
import PatientRecords from "./pages/Dashboard_Clinician/Components/PatientRecords";
import ClinicianSettings from "./pages/Dashboard_Clinician/Components/ClinicianSettings";

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

            { path: "/auth", element: <AuthPage /> },
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
