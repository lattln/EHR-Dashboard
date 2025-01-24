import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export const App = () => {
  const [userInput, setUserInput] = useState('');
  const [responseJSON, setResponseJSON] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSend = () => {
    setErrorMsg('');

    // Call Meteor method to send data to OpenAI
    Meteor.call('callOpenAI', userInput, (error, result) => {
      if (error) {
        console.error(error);
        setErrorMsg(error.reason || 'An unknown error occurred.');
        setResponseJSON(null);
      } else {
        // `result` is our JSON structure from the server
        setResponseJSON(result);
      }
    });
  };

    return (
        <div style={{ fontFamily: 'sans-serif', margin: '40px' }}>
        <h1>OpenAI + Meteor + React</h1>
        
        <div style={{ marginBottom: '20px' }}>
            <label>
            Enter your prompt:
            <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                style={{ marginLeft: '10px', width: '300px' }}
            />
            </label>
            <button onClick={handleSend} style={{ marginLeft: '10px' }}>
            Send to OpenAI
            </button>
        </div>

        {errorMsg && (
            <div style={{ color: 'red', marginBottom: '20px' }}>
            <strong>Error:</strong> {errorMsg}
            </div>
        )}

        {responseJSON && (
            <div>
            <h2>JSON Response:</h2>
            <pre style={{ background: '#f4f4f4', padding: '10px' }}>
                {JSON.stringify(responseJSON, null, 2)}
            </pre>
            </div>
        )}
        </div>
    );
};
