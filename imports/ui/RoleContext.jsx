import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const useRole = () => {
    return useContext(RoleContext);  
};

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(null); 

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
};
