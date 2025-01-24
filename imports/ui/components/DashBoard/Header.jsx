import React, { useState } from 'react';

const Header = () => {
    const [userInput, setUserInput] = useState('');
        const [response, setResponse] = useState('');
        const [errorMsg, setErrorMsg] = useState('');
    
        const handleInputChange = (e) => {
            setUserInput(e.target.value);
        }
    
        const handleSend = () => {
            setErrorMsg('');
    
            Meteor.call('openai.send', userInput, (error, result) => {
                if (error) {
                    console.error(error);
                    setErrorMsg(error.reason || 'An unknown error occurred.');
                    setResponse(null);
                } else {
                    setResponse(result);
                    console.log(response)
                }
            });
        }

    return (
        <div className="bg-base-100 shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary">Dashboard</h1>
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="input input-bordered w-48"
                    onChange={handleInputChange}
                />
                <button onClick={handleSend} style={{ marginLeft: '10px' }}>Send to OpenAI</button>
            </div>
        </div>
    );
};

export default Header;
