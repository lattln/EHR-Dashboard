import React, { useState, useEffect } from "react";
import { getAuthUrl, isValidToken, refreshToken } from "../../../../api/FitBit/auth";
import { dashboardConfig } from "../../dashBoardConfig";
import { useUser } from "../../../User";

const Settings = () => {
    const [fitBitUrl, setFitBitUrl] = useState({});
    const [fitBitLinked, setFitBitLinked] = useState(false);
    const [currentConfig, setCurrentConfig] = useState(dashboardConfig);
    const { user, userLoading } = useUser();

    const linkFitBit = (e) => {
        e.preventDefault();
        window.location.href = fitBitUrl;
    }

    useEffect(() => {
        const getLink = async () => {
            setFitBitUrl(await getAuthUrl(window.location.origin));
        }

        getLink();
    }, [])

    useEffect(() => {
        if(!userLoading && user.fitbitAccountAuth != null && user.fitbitAccountAuth.length > 0) {
            if (!isValidToken(user.fitbitAccountAuth)) {
                refreshToken(user.fitbitAccountAuth);
            }
            setFitBitLinked(true);
        }

        // Check for persisted configuration in localStorage
        const persistedConfig = localStorage.getItem("dashboardConfig");
        if (persistedConfig) {
            setCurrentConfig(JSON.parse(persistedConfig));
        }
    }, [userLoading])

    const handlePresetChange = (preset) => {
        setCurrentConfig(preset);
        
        // Persist the new config in localStorage
        localStorage.setItem("dashboardConfig", JSON.stringify(preset));
    };

    // Example presets, these can be updated with specific layout configurations
    const presets = [
        {
            id: 1, name: "Preset 1", layout:
                [
                    { id: `dummyWidget-1`, label: "Place Holder Widget 1", type: "DummyWidget" },
                    { id: `dummyWidget-2`, label: "Place Holder Widget 2", type: "DummyWidget" },
                    { id: `dummyWidget-3`, label: "Place Holder Widget 3", type: "DummyWidget" },
                    { id: `dummyWidget-4`, label: "Place Holder Widget 4", type: "DummyWidget" },
                    { id: `dummyWidget-5`, label: "Place Holder Widget 5", type: "DummyWidget" },
                    { id: `dummyWidget-6`, label: "Place Holder Widget 6", type: "DummyWidget" },
                    { id: `dummyWidget-7`, label: "Place Holder Widget 7", type: "DummyWidget" },
                ]
        },
        {
            id: 2, name: "Preset 2", layout:
                [
                    { id: `dummyWidget-7`, label: "Place Holder Widget 7", type: "DummyWidget" },
                    { id: `dummyWidget-6`, label: "Place Holder Widget 6", type: "DummyWidget" },
                    { id: `dummyWidget-5`, label: "Place Holder Widget 5", type: "DummyWidget" },
                    { id: `dummyWidget-4`, label: "Place Holder Widget 4", type: "DummyWidget" },
                    { id: `dummyWidget-3`, label: "Place Holder Widget 3", type: "DummyWidget" },
                    { id: `dummyWidget-2`, label: "Place Holder Widget 2", type: "DummyWidget" },
                    { id: `dummyWidget-1`, label: "Place Holder Widget 1", type: "DummyWidget" },
                ]
        },
        {
            id: 3, name: "Preset 3", layout:
                [
                    { id: `dummyWidget-4`, label: "Place Holder Widget 4", type: "DummyWidget" },
                    { id: `dummyWidget-3`, label: "Place Holder Widget 3", type: "DummyWidget" },
                    { id: `dummyWidget-1`, label: "Place Holder Widget 1", type: "DummyWidget" },
                    { id: `dummyWidget-6`, label: "Place Holder Widget 6", type: "DummyWidget" },
                    { id: `dummyWidget-5`, label: "Place Holder Widget 5", type: "DummyWidget" },
                    { id: `dummyWidget-2`, label: "Place Holder Widget 2", type: "DummyWidget" },
                    { id: `dummyWidget-7`, label: "Place Holder Widget 7", type: "DummyWidget" },
                ]
        },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>

            {/* Link FitBit Section */}
            <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                onClick={linkFitBit}
                disabled={fitBitLinked}
            >
                Link FitBit Account
            </button>

            {/* Preset Layout Section */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Preset Layouts</h3>
                <ul className="space-y-2">
                    {presets.map((preset) => (
                        <li key={preset.id}>
                            <button
                                className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                                onClick={() => handlePresetChange(preset.layout)}
                            >
                                {preset.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Settings;
