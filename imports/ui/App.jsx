import React from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthPage from "./pages/LoginPages/AuthPage";
import DashBoard from "./pages/DashBoard/DashBoard";
import NotFound from "./pages/NotFound";
import DevLanding from "./pages/DevLandingPage/DevLanding";
import UserSettings from './pages/DashBoard/ComponentsAndConstants/UserSettings';
import SideNavBar from "./pages/DashBoard/ComponentsAndConstants/SideNavBar";
import Token from "./pages/Token";


const AppLayout = () => (
    <>
        <div className="hidden sm:flex">
            <SideNavBar />
        </div>

        <div className="ml-0 sm:ml-60">
            <Outlet />
        </div>
    </>
)

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <AppLayout />,
            children: [
                { index: true, element: <Navigate to="/dev" replace /> },
                { path: "dashboard", element: <DashBoard /> },
                { path: "user", element: <UserSettings /> },
                { path: "*", element: <NotFound />},
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
