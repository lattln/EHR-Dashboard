import React from "react";
import { AnimatePresence } from "framer-motion";
import Routes from "./Routes";
import { UserProvider } from "./User";

const App = () => {
    return (
        <UserProvider>
            <AnimatePresence>
                <Routes />
            </AnimatePresence>
        </UserProvider>
    );
};

export default App;
