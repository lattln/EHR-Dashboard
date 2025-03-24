import React, { useEffect, useRef, useState, useMemo } from 'react';
import Header from './ComponentsAndConstants/Header';
import { USER_INFO } from './ComponentsAndConstants/dashBoardData';
import ChartContainer from './ComponentsAndConstants/ChartContainer';
import { dashboardConfig } from "./ComponentsAndConstants/dashBoardConfig";
import Widgets from './ComponentsAndConstants/Widgets';
import { createSwapy, utils } from 'swapy';
import { isValidToken, refreshToken } from '../../../api/FitBit/auth';
import { motion, AnimatePresence } from 'framer-motion';

const DashBoard = () => {
    const [widgets, setWidgets] = useState([]);
    const [slotItemMap, setSlotItemMap] = useState([]);
    const [fitBitLinked, setFitBitLinked] = useState(false);
    const slottedItems = useMemo(() => utils.toSlottedItems(widgets, 'id', slotItemMap), [widgets, slotItemMap]);
    const swapyRef = useRef(null);
    const container = useRef(null);

    useEffect(() => {
        // Load the persisted configuration from localStorage
        const persistedConfig = localStorage.getItem("dashboardConfig");
        if (persistedConfig) {
            setWidgets(JSON.parse(persistedConfig));
        } else {
            setWidgets(dashboardConfig); // Fallback to default config
        }
    }, []);

    useEffect(() => utils.dynamicSwapy(swapyRef.current, widgets, 'id', slotItemMap, setSlotItemMap), [widgets]);

    // Initialize Swapy
    useEffect(() => {
        if (container.current) {
            swapyRef.current = createSwapy(container.current, {
                manualSwap: true,
                enabled: false
            });

            swapyRef.current.onSwap((event) => {
                setSlotItemMap(event.newSlotItemMap.asArray);
            });
        }

        return () => {
            swapyRef.current?.destroy();
        };
    }, []);

    // Check if Fitbit is linked and refresh token if needed
    useEffect(() => {
        async function checkFitBitLinked() {
            let token = localStorage.getItem('fitbit-token');
            if (token != null) {
                if (!(await isValidToken(token))) {
                    refreshToken(token);
                }
                setFitBitLinked(true);
            }
        }

        checkFitBitLinked();
    }, []);

    // Save the current widget configuration to localStorage
    useEffect(() => {
        if (widgets.length > 0) {
            localStorage.setItem("dashboardConfig", JSON.stringify(widgets));
        }
    }, [widgets]);

    // Define staggered animation variants for widgets
    const widgetVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.1 }
        }),
    };

    // Header animation variant (coming from the top)
    const headerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="flex min-h-screen bg-base-200 bg-gray-100">
            <div className="flex flex-col flex-1">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={headerVariants}
                >
                    <Header />
                </motion.div>

                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-blue-600 text-white rounded-lg shadow-lg p-6">
                        <div>
                            <p className="font-semibold">{USER_INFO.name.label}: {USER_INFO.name.firstName} {USER_INFO.name.lastName}</p>
                            <p className="font-semibold">{USER_INFO.birth.label}: {USER_INFO.birth.value}</p>
                        </div>
                        <div>
                            <p className="font-semibold">{USER_INFO.physician.label}: {USER_INFO.physician.value}</p>
                            <p className="font-semibold">{USER_INFO.gender.label}: {USER_INFO.gender.value}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{USER_INFO.lastAppt.label}: {USER_INFO.lastAppt.value}</p>
                            <input type="checkbox" onChange={(event) => {
                                if (event.target.checked) {
                                    swapyRef.current.enable(true);
                                } else {
                                    swapyRef.current.enable(false);
                                }
                            }} />
                        </div>
                    </div>

                    <div
                        ref={container}
                        className="Container-Grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 text-black overflow-clip">

                        <AnimatePresence>
                            {slottedItems.map(({ slotId, itemId, item: widget }, index) => {
                                if (!widget) {
                                    return null;
                                }

                                const WidgetComponent = Widgets[widget.type];

                                return (
                                    <motion.div
                                        key={slotId}
                                        data-swapy-slot={slotId}
                                        className="bg-white/30 rounded-lg shadow-md h-80"
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={widgetVariants}
                                        custom={index}
                                    >
                                        {widget && (
                                            <div
                                                key={itemId}
                                                data-swapy-item={itemId}
                                                className="w-full h-full bg-white p-4 rounded-lg">
                                                <div className={`col-span-width p-2`}>
                                                    <div>{itemId}</div>
                                                    <WidgetComponent fitBitLinked={fitBitLinked} />
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
