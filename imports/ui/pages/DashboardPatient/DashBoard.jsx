import React, { useEffect, useRef, useState, useMemo } from 'react';
import { USER_INFO } from '../constantsPages';
import { dashboardConfig } from "../dashBoardConfig";
import Widgets from '../../Widgets';
import { createSwapy, utils } from 'swapy';
import { isValidToken, refreshToken } from '../../../api/FitBit/auth';
import { motion, AnimatePresence } from 'framer-motion';
import Summary from './Components/Summary';
import { ChatBot } from '../ChatBot';
import { Meteor } from 'meteor/meteor';
import { useUser } from '../../User';
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
    const { user, presetName } = useUser();
    const [userInfo, setUserInfo] = useState({
        first: "",
        last: "",
        dob: ""
    })
    const [widgets, setWidgets] = useState([]);
    const [slotItemMap, setSlotItemMap] = useState([]);
    const [fitBitLinked, setFitBitLinked] = useState(false);
    const slottedItems = useMemo(() => utils.toSlottedItems(widgets, 'id', slotItemMap), [widgets, slotItemMap]);
    const [editing, setEditing] = useState(false);
    const swapyRef = useRef(null);
    const container = useRef(null);
    const nav = useNavigate();

    useEffect(() => {
        async function checkFitbitLinked(){
            if(!await isValidToken(user.user.fitbitAccountAuth)){
                await refreshToken(user.user.fitbitAccountAuth);
            }

            setFitBitLinked(true);
        }

        if (Meteor.userId() == null) {
            nav('/auth')
        }

        if(!user.userLoading){
            console.log(user.user);
            setWidgets([...user.user.config[0].widget]);
            setUserInfo({
                first: user.user.profile.firstName,
                last: user.user.profile.lastName,
                dob: user.user.profile.dob 
            })

            if(user.user.fitbitAccountAuth){
                checkFitbitLinked();
            }
        }

    }, [user.userLoading])

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

    // Save the current widget configuration to localStorage
    useEffect(() => {
        async function updateConfig(){
            /*
            let filtered = user.user.config.filter((c) => c.name != presetName);
            let res = await Meteor.callAsync('user.saveDashboardConfig', [
                {
                    name: user.user.config[0].name,
                    widget: widgets
                },
                ...filtered
            ])

            console.log(res);
            */
        }

        if(!user.userLoading){
            updateConfig();
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
                </motion.div>
                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-blue-600 text-white rounded-lg shadow-lg p-6">
                        <div>
                            <p className="font-semibold">Name: {userInfo.first + " " + userInfo.last}</p>
                            <p className="font-semibold">Birthday: {userInfo.dob}</p>
                        </div>
                        <div>
                            <p className="font-semibold">{USER_INFO.physician.label}: {USER_INFO.physician.value}</p>
                            <p className="font-semibold">{USER_INFO.gender.label}: {USER_INFO.gender.value}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{USER_INFO.lastAppt.label}: {USER_INFO.lastAppt.value}</p>
                            <input type="checkbox" value={editing} onChange={(event) => {
                                if (event.target.checked) {
                                    setEditing(false);
                                    swapyRef.current.enable(true);
                                } else {
                                    setEditing(true);
                                    swapyRef.current.enable(false);
                                }
                            }} />
                        </div>
                    </div>
                    <Summary />
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
                                        style={{ gridColumn: 'span ' + widget.width }}
                                    >
                                        {widget && (
                                            <div
                                                key={itemId}
                                                data-swapy-item={itemId}
                                                className="w-full h-full bg-white p-4 rounded-lg"
                                            >
                                                <div className="col-span-width p-2 h-full">
                                                    <h2 className="text-lg font-bold">{widget.label}</h2>
                                                    <WidgetComponent fitBitLinked={fitBitLinked} />
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                    <ChatBot />
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
