import { createContext, useContext, useState } from "react";

const contextAPI = createContext();

export const ContextProvider = ({ children }) => {
    // Function to safely get the initial token
    const getInitialToken = () => {
        const storedToken = localStorage.getItem("JWT_TOKEN");

        // If no token exists or it's the bad "undefined" string, return null
        if (!storedToken || storedToken === "undefined") {
            return null;
        }

        try {
            // This is the safe way to parse
            return JSON.parse(storedToken);
        } catch (error) {
            console.error("Failed to parse token from localStorage", error);
            // If parsing fails for any reason, return null
            return null;
        }
    };

    const [token, settoken] = useState(getInitialToken());

    const sendData = {
        token,
        settoken
    };

    return <contextAPI.Provider value={sendData}>{children}</contextAPI.Provider>;
};

export const useStoreContext=()=>{
    const context = useContext(contextAPI);
    return context;
}