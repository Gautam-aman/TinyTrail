import { createContext, useContext, useState } from "react";

const contextAPI = createContext();

export const ContextProvider = ({ children }) => {
    
  
    const getInitialToken = () => {
        const storedToken = localStorage.getItem("JWT_TOKEN");
        
        
        if (!storedToken || storedToken === "undefined") {
            return null;
        }
        
        
        return storedToken;
    };

    const [token, setToken] = useState(getInitialToken());

    
    const login = (tokenString) => {
        if (tokenString) {
            localStorage.setItem("JWT_TOKEN", tokenString);
            setToken(tokenString);
        }
    };

    
    const logout = () => {
        localStorage.removeItem("JWT_TOKEN");
        setToken(null);
    };

   
    const sendData = {
        token,
        login,  
        logout  
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