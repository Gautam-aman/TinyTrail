import { createContext, useContext, useState } from "react";

const contextAPI = createContext();

export const ContextProvider = ({ children }) => {
    
    // Function to safely get the initial token
    const getInitialToken = () => {
        const storedToken = localStorage.getItem("JWT_TOKEN");
        
        // If no token exists or it's the literal string "undefined", return null
        if (!storedToken || storedToken === "undefined") {
            return null;
        }
        
        // Otherwise, return the token string itself
        return storedToken;
    };

    const [token, setToken] = useState(getInitialToken());

    // --- NEW: Function to store the token ---
    // We'll call this 'login' to match what your components expect
    const login = (tokenString) => {
        if (tokenString) {
            localStorage.setItem("JWT_TOKEN", tokenString);
            setToken(tokenString);
        }
    };

    // --- NEW: Logout function ---
    const logout = () => {
        localStorage.removeItem("JWT_TOKEN");
        setToken(null);
    };

    // Data to be passed to all components
    const sendData = {
        token,
        login,  // <-- Pass the new login function
        logout  // <-- Pass the new logout function
    };

    return <contextAPI.Provider value={sendData}>{children}</contextAPI.Provider>;
};

export const useStoreContext = () => {
    const context = useContext(contextAPI);
    if (!context) {
        throw new Error("useStoreContext must be used within a ContextProvider");
    }
    return context;
};