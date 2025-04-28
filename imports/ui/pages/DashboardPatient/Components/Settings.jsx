import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getAuthUrl, isValidToken, refreshToken } from "../../../../api/FitBit/auth";
import { useUser } from "../../../User";
import { motion } from "framer-motion";
import Widgets from "../../../Widgets/index";
import ThreeDotsWave from "../../three-dots-wave";

const reorder = (list, start, end) => {
    const copy = Array.from(list);
    const [m] = copy.splice(start, 1);
    copy.splice(end, 0, m);
    return copy;
};

const Settings = () => {
    const { user, userLoading, refreshUser } = useUser();
    const [fitBitUrl, setFitBitUrl] = useState("");
    const [fitBitLinked, setFitBitLinked] = useState(false);

    const [presets, setPresets] = useState([]);
    const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState("");

    // dropdown for adding widgets
    const widgetTypes = Object.keys(Widgets);
    const [newWidgetType, setNewWidgetType] = useState(widgetTypes[0] || "");

    // load FitBit URL
    useEffect(() => {
        getAuthUrl(window.location.origin).then(setFitBitUrl);
    }, []);

    // check token
    useEffect(() => {
        if (!userLoading && user.fitbitAccountAuth) {
            if (!isValidToken(user.fitbitAccountAuth)) {
                refreshToken(user.fitbitAccountAuth);
            }
            setFitBitLinked(true);
        }
    }, [userLoading]);

    // seed presets
    useEffect(() => {
        if (!userLoading) {
            const cfg = Array.isArray(user?.config) ? user.config : [];
            setPresets(cfg);
            setSelectedPresetIndex(0);
        }
    }, [userLoading, user?.config]);

    // persist full presets array
    const savePresets = (newPresets, cb) => {
        Meteor.call("user.saveDashboardConfig", newPresets, err => {
            if (err) {
                alert("Save failed: " + err.reason);
            } else {
                setPresets(newPresets);
                refreshUser();
                if (cb) cb();
            }
        });
    };

    // clicking a preset bumps it to front
    const handlePresetChange = i => {
        if (i === 0) return setSelectedPresetIndex(0);
        const reordered = [presets[i], ...presets.filter((_, idx) => idx !== i)];
        savePresets(reordered, () => setSelectedPresetIndex(0));
    };

    // delete preset
    const handleDeletePreset = i => {
        if (!window.confirm(`Delete "${presets[i].name}"?`)) return;
        const next = presets.filter((_, idx) => idx !== i);
        savePresets(next, () => setSelectedPresetIndex(idx => Math.min(idx, next.length - 1)));
    };

    // add preset
    const handleAddPreset = () => {
        const base = presets[selectedPresetIndex]?.widget || [];
        const next = [...presets, { name: "New Preset", widget: [...base] }];
        savePresets(next, () => {
            setSelectedPresetIndex(next.length - 1);
            setIsRenaming(true);
            setRenameValue("New Preset");
        });
    };

    // rename flows
    const startRenaming = () => {
        setIsRenaming(true);
        setRenameValue(presets[selectedPresetIndex].name);
    };
    const commitRename = () => {
        const t = renameValue.trim();
        if (t) {
            const next = presets.map((p, idx) =>
                idx === selectedPresetIndex ? { ...p, name: t } : p
            );
            savePresets(next, () => setIsRenaming(false));
        } else {
            setIsRenaming(false);
        }
    };
    const onRenameKeyDown = e => {
        if (e.key === "Enter") commitRename();
        if (e.key === "Escape") setIsRenaming(false);
    };

    // add widget to preset
    const handleAddWidget = () => {
        const type = newWidgetType;
        const id = `${type}-${Date.now()}`;
        const w = { id, label: type, type, height: 1, width: 1 };
        setPresets(ps =>
            ps.map((p, idx) =>
                idx === selectedPresetIndex
                    ? { ...p, widget: [...(p.widget || []), w] }
                    : p
            )
        );
    };

    // drag & drop reorder
    const onDragEnd = result => {
        if (!result.destination) return;
        const updated = reorder(
            presets[selectedPresetIndex].widget,
            result.source.index,
            result.destination.index
        );
        setPresets(ps =>
            ps.map((p, idx) =>
                idx === selectedPresetIndex ? { ...p, widget: updated } : p
            )
        );
    };

    // arrow move handler
    const moveWidget = (idx, dir) => {
        const list = presets[selectedPresetIndex].widget || [];
        const swapIdx = idx + dir;
        if (swapIdx < 0 || swapIdx >= list.length) return;
        const updated = [...list];
        [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
        setPresets(ps =>
            ps.map((p, i) =>
                i === selectedPresetIndex ? { ...p, widget: updated } : p
            )
        );
    };

    // save all edits
    const handleSave = () => savePresets(presets, () => alert("Layouts saved!"));

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    if (userLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <ThreeDotsWave size="1rem" />
                </motion.div>
            </div>
        )
    }

    return (
        <motion.div
            className="p-6 bg-white rounded-lg shadow-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Section 1: Title & Fitbit Button */}
            <motion.div variants={sectionVariants} className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Settings</h2>
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => (window.location.href = fitBitUrl)}
                    disabled={fitBitLinked}
                >
                    {fitBitLinked ? "FitBit Linked" : "Link FitBit Account"}
                </button>
            </motion.div>

            {/* Section 2: Preset Picker */}
            <motion.div variants={sectionVariants} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Preset Layouts</h3>
                <div className="flex flex-wrap gap-2">
                    {presets.map((p, i) => (
                        <motion.div
                            key={i}
                            variants={listItemVariants}
                            className="flex items-center space-x-1"
                        >
                            <button
                                className={`px-4 py-2 rounded-lg ${i === 0 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                                onClick={() => handlePresetChange(i)}
                            >
                                {p.name}
                            </button>
                            <button
                                onClick={() => handleDeletePreset(i)}
                                className="text-red-500 hover:text-red-700 px-1"
                                title="Delete preset"
                            >
                                &times;
                            </button>
                        </motion.div>
                    ))}
                    <motion.button
                        variants={listItemVariants}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        onClick={handleAddPreset}
                    >
                        + Add Preset
                    </motion.button>
                </div>
            </motion.div>

            {/* Section 3: Inline Rename */}
            <motion.div variants={sectionVariants} className="mb-6 flex items-center space-x-2">
                {isRenaming ? (
                    <input
                        className="border px-2 py-1 rounded"
                        value={renameValue}
                        autoFocus
                        onChange={e => setRenameValue(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={onRenameKeyDown}
                    />
                ) : (
                    <>
                        <span className="font-medium">{presets[selectedPresetIndex]?.name}</span>
                        <button
                            className="text-sm text-blue-500 hover:underline"
                            onClick={startRenaming}
                        >
                            Rename
                        </button>
                    </>
                )}
            </motion.div>

            {/* Section 4: Add Widget */}
            <motion.div variants={sectionVariants} className="mb-6 flex space-x-2 items-center">
                <select
                    className="p-2 border rounded flex-1"
                    value={newWidgetType}
                    onChange={e => setNewWidgetType(e.target.value)}
                >
                    {widgetTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    onClick={handleAddWidget}
                >
                    + Add Widget
                </button>
            </motion.div>

            {/* Section 5: Drag & Drop Widget List */}
            <motion.div variants={sectionVariants} className="mb-6">
                {presets[selectedPresetIndex]?.widget?.length > 0 ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="widgets-list">
                            {provided => (
                                <motion.ul
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-2"
                                    variants={containerVariants}        // you can even nest a smaller stagger here
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {presets[selectedPresetIndex].widget.map((w, idx) => (
                                        <Draggable key={w.id} draggableId={w.id} index={idx}>
                                            {prov => (
                                                <motion.li
                                                    ref={prov.innerRef}
                                                    {...prov.draggableProps}
                                                    {...prov.dragHandleProps}
                                                    className="p-4 bg-gray-100 rounded shadow flex items-center justify-between"
                                                    variants={listItemVariants}
                                                >
                                                    <span>{w.label}</span>
                                                    <div className="flex flex-col space-y-1">
                                                        <button
                                                            onClick={() => moveWidget(idx, -1)}
                                                            className="text-gray-600 hover:text-gray-800"
                                                            title="Move up"
                                                        >
                                                            ▲
                                                        </button>
                                                        <button
                                                            onClick={() => moveWidget(idx, +1)}
                                                            className="text-gray-600 hover:text-gray-800"
                                                            title="Move down"
                                                        >
                                                            ▼
                                                        </button>
                                                    </div>
                                                </motion.li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </motion.ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                ) : (
                    <p className="italic text-gray-500">No widgets in this preset.</p>
                )}
            </motion.div>

            {/* Section 6: Save Button */}
            <motion.div variants={sectionVariants}>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={handleSave}
                >
                    Save Layouts
                </button>
            </motion.div>
        </motion.div>
    );
};

export default Settings;
