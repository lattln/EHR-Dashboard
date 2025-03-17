import React, { useEffect, useRef, useState, useMemo } from 'react';
import Header from './ComponentsAndConstants/Header';
import { USER_INFO } from './ComponentsAndConstants/dashBoardData';
import { IconSave } from '../svgLibrary';
import ChartContainer from './ComponentsAndConstants/ChartContainer';
import { dashboardConfig } from "./ComponentsAndConstants/dashBoardConfig";
import Widgets from './ComponentsAndConstants/Widgets';
import { createSwapy, utils } from 'swapy'
import { isValidToken, refreshToken } from '../../../api/FitBit/auth';

const DashBoard = () => {

    const [widgets, setWidgets] = useState(dashboardConfig);
    const [slotItemMap, setSlotItemMap] = useState(utils.initSlotItemMap(widgets, 'id'));
    const [fitBitLinked, setFitBitLinked] = useState(false);
    const slottedItems = useMemo(() => utils.toSlottedItems(widgets, 'id', slotItemMap), [widgets, slotItemMap]);
    useEffect(() => utils.dynamicSwapy(swapyRef.current, widgets, 'id', slotItemMap, setSlotItemMap), [widgets]);
    const swapyRef = useRef(null);
    const container = useRef(null);

    useEffect(() => {
        // If container element is loaded
        if (container.current) {
            swapyRef.current = createSwapy(container.current, {
                manualSwap: true,
                enabled: false
            })

            // Your event listeners
            swapyRef.current.onSwap((event) => {
                setSlotItemMap(event.newSlotItemMap.asArray)
            })
        }

        return () => {
            // Destroy the swapy instance on component destroy
            swapyRef.current?.destroy()
        }
    }, [])

    //refreshes token if one exists
    useEffect(() => {
        async function checkFitBitLinked(){
            let token = localStorage.getItem('fitbit-token');
            if(token != null){
                if(!(await isValidToken(token))){
                    refreshToken(token);
                }
                
                setFitBitLinked(true);
            }
        }

        checkFitBitLinked();
    }, [])

    return (
        <div className="flex min-h-screen bg-base-200 bg-gray-100">
            <div className="flex flex-col flex-1">
                <Header />

                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-600 text-white rounded-lg shadow-lg p-6">
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
                                if(event.target.checked) {
                                    console.log("this shit is true")
                                    swapyRef.current.enable(true)
                                }
                                else {
                                    swapyRef.current.enable(false)
                                }
                            }}></input>
                        </div>
                    </div>

                    <div
                        ref={container}
                        className="Container-Grid grid grid-cols-4 gap-4 min-h-screen text-black">

                        {slottedItems.map(({ slotId, itemId, item: widget }) => {
                            if (!widget) {
                                return null;
                            }
                            const WidgetComponent = Widgets[widget.type];

                            return (
                                <div key={slotId} data-swapy-slot={slotId} className="bg-white/30 rounded-lg shadow-md">

                                    {widget &&
                                        <div key={itemId} data-swapy-item={itemId} className="w-full h-full bg-white p-4">
                                            <div className={`col-span-width p-2`}>
                                                <WidgetComponent fitBitLinked={fitBitLinked} />
                                            </div>
                                            <span className="delete" data-swapy-no-drag onClick={() => {
                                                setWidgets(widgets.filter(i => i.id !== widget.id))
                                            }}>Delete</span>
                                        </div>
                                    }

                                </div>
                            );
                        })}
                    </div>
                    <div className="" onClick={() => {
                        const newWidget = { id: `appointment`, type: `Appointments` }
                        setWidgets([...widgets, newWidget])
                    }}>+</div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;



