import React, { useState } from "react";

export const ChatBot = () => {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const askChatbot = () => {
        setLoading(true);
        Meteor.call("echo.ask", question, (err, res) => {
            setLoading(false);
            if (err) {
                setResponse("Error: " + err.message);
            } else {
                setResponse(res);
            }
        });
        //Meteor.call("echo.embedPatientData", 1);
    };

    return (
        <div>
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a health question..."
            />
            <button onClick={askChatbot} disabled={loading}>
                {loading ? "Asking..." : "Ask"}
            </button>
            <p>{response}</p>
        </div>
    );
};
