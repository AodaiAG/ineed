import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Function to verify authentication by calling /verify-auth
    const verifyAuth = useCallback(async () => {
        console.log("verifyAuth called");
        setLoading(true); // Begin loading state

        try {
            const response = await api.get('/auth/verify-auth');

            if (response.headers['x-access-token']) {
                console.log("Storing new access token...");
                localStorage.setItem('accessToken', response.headers['x-access-token']);
            }
            if (response.headers['x-refresh-token']) {
                console.log("Storing new refresh token...");
                localStorage.setItem('refreshToken', response.headers['x-refresh-token']);
            }

            setUser(response.data.decryptedUserdata);
            setIsAuthenticated(true);
            console.log("User authenticated, data:", response.data.decryptedUserdata);
        } catch (error) {
            console.error('Authentication verification failed:', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false); // End loading state
            console.log("Setting loading to false.");
        }
    }, []);

  

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, verifyAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
