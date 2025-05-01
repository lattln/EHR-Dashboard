import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeDotsWave from "./three-dots-wave";
import { useUser } from "../User";

export const ChatBot = () => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 320, height: 384 });
    const [dragging, setDragging] = useState(false);
    const { user, userLoading } = useUser();

    const popupRef = useRef(null);
    const messagesEndRef = useRef(null);
    const resizing = useRef(false);
    const startMouse = useRef({ x: 0, y: 0 });
    const startSize = useRef({ width: 320, height: 384 });

    const askChatbot = () => {
        if (!question.trim()) return;
        const userMessage = { role: "user", content: question };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);
        setQuestion("");

        Meteor.call("echo.ask", user.fhirID, question, (err, res) => {
            setLoading(false);

            const botMessageContent = err ? `Error: ${err.message}` : res?.response;
            const loincCodes = res?.loincCodes || [];


            const botMessage = {
                content: botMessageContent,
                loincCodes,
            };

            console.log(botMessage)
            setMessages((prev) => [...prev, botMessage]);
        });
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!resizing.current) return;
            const dx = startMouse.current.x - e.clientX;
            const dy = startMouse.current.y - e.clientY;
            const newWidth = Math.min(Math.max(280, startSize.current.width + dx), 600);
            const newHeight = Math.min(Math.max(300, startSize.current.height + dy), 700);
            setDimensions({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            resizing.current = false;
            setDragging(false);
            document.body.classList.remove("no-select");
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const popupVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 50, scale: 0.95 },
    };

    return (
        <>
            <style>
                {`
                    .no-select {
                        user-select: none !important;
                    }
                `}
            </style>

            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="chat-popup"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={popupVariants}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{
                                width: dimensions.width,
                                height: dimensions.height,
                                pointerEvents: dragging ? "none" : "auto",
                            }}
                            className="bg-white p-4 rounded-xl shadow-2xl border border-gray-200 flex flex-col relative overflow-hidden"
                            ref={popupRef}
                        >
                            {/* Resize Handle */}
                            <div
                                onMouseDown={(e) => {
                                    resizing.current = true;
                                    setDragging(true);
                                    startMouse.current = { x: e.clientX, y: e.clientY };
                                    startSize.current = { ...dimensions };
                                    document.body.classList.add("no-select");
                                }}
                                className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize bg-blue-500 rounded-tr-md z-10"
                                title="Resize"
                            />

                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-sm font-bold">Echo Assistant</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Chat */}
                            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3 }}
                                            className={`rounded-xl px-4 py-2 text-sm max-w-[80%] whitespace-pre-wrap ${msg.role === "user"
                                                ? "bg-blue-600 text-white self-end ml-auto mr-2"
                                                : "bg-gray-100 text-gray-800 self-start mr-auto ml-2"
                                                }`}
                                        >
                                            {msg.content}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex space-x-1 items-center pt-6 pl-2"
                                    >
                                        <ThreeDotsWave size=".25rem" />
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Ask a question..."
                                className="w-full border p-2 rounded text-sm resize-none mt-2 mb-1"
                                rows={2}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        askChatbot();
                                    }
                                }}
                            />
                            <button
                                onClick={askChatbot}
                                disabled={loading || !question.trim()}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition w-fit self-end"
                            >
                                Send
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Button */}
                <button
                    className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    💬
                </button>
            </div>
        </>
    );
};
