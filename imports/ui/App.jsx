import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./pages/LoginPages/Login";
import DashBoard from "./pages/DashBoard";
import NotFound from "./pages/NotFound";
import DevLanding from "./pages/DevLanding";
import Layout from "./Layout";
import Register from "./pages/LoginPages/Register";

// Define your routes
const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout />,
            children: [
                { index: true, element: <Navigate to="/dev" replace /> },
                { path: "dashboard", element: <DashBoard /> },
            ],
        },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "dev", element: <DevLanding /> },
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
    return <RouterProvider router={router} />;
};

export default App;
