import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./ComponentsAndConstants/Login";
import Register from "./ComponentsAndConstants/Register";

// Framer Motion Variants
const pageVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
};

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-8">
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3"
            >
                {/* Animate Presence ensures smooth transitions */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLogin ? "login" : "register"}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4 }}
                        layout
                    >
                        {isLogin ? (
                            <Login toggleAuth={() => setIsLogin(false)} />
                        ) : (
                            <Register toggleAuth={() => setIsLogin(true)} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default AuthPage;
