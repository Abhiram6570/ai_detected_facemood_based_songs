import React, { createContext, useState, useContext } from 'react';
import { Navigate } from 'react-router';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData); // Set user data in state
        // Note: No local storage usage for security
    };

    const logout = () => {
        setUser(null); // Clear user data from state
        Navigate("/Login");   
    };



    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
