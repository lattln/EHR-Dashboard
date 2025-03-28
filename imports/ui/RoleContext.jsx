import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const useRole = () => {
    return useContext(RoleContext);  
};

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(null); 

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);  
        }
    }, []);

    const updateRole = (newRole) => {
        setRole(newRole);
        localStorage.setItem('role', newRole);  
    };

    return (
        <RoleContext.Provider value={{ role, setRole: updateRole }}>
            {children}
        </RoleContext.Provider>
    );
};
