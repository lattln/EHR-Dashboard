import { motion } from "framer-motion";
import React from "react";

export default function ThreeDotsWave({ size = "2rem" }) {

    const dotSize = size;
    const containerSize = `calc(${size} * 5)`;

    const LoadingDot = {
        display: "block",
        width: dotSize,
        height: dotSize,
        backgroundColor: "black",
        borderRadius: "50%"
    };

    const LoadingContainer = {
        width: containerSize,
        height: size,
        display: "flex",
        justifyContent: "space-around"
    };

    const ContainerVariants = {
        initial: {
            transition: {
                staggerChildren: 0.2
            }
        },
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const DotVariants = {
        initial: { y: 0 },
        animate: { y: ["0%", "-100%", "0%"] }
    };


    const DotTransition = {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
    };

    return (
        <div>
            <motion.div
                style={LoadingContainer}
                variants={ContainerVariants}
                initial="initial"
                animate="animate"
            >
                <motion.span
                    style={LoadingDot}
                    variants={DotVariants}
                    transition={DotTransition}
                />
                <motion.span
                    style={LoadingDot}
                    variants={DotVariants}
                    transition={DotTransition}
                />
                <motion.span
                    style={LoadingDot}
                    variants={DotVariants}
                    transition={DotTransition}
                />
            </motion.div>
        </div>
    );
}
