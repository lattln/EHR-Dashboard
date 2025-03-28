import React from "react";
import { AnimatePresence } from "framer-motion";
import Routes from "./Routes";
import { RoleProvider } from "./RoleContext";

const App = () => {
    return (
        <RoleProvider >
            <AnimatePresence>
                <Routes />
            </AnimatePresence>
        </RoleProvider>
    );
};

export default App;
