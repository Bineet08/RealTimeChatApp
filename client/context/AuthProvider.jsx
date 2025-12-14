import axios from 'axios';
import { useEffect, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    });
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    const connectSocket = useCallback((userData) => {
        if (!userData || socketRef.current?.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });

        newSocket.connect();
        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on('getOnlineUsers', (userIds) => {
            setOnlineUsers(userIds);
        });
    }, []);

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', data.token);
                }
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            toast.error(message);
        }
    };

    const logout = async () => {
        try {
            const { data } = await axios.post('/api/auth/logout');

            // Clear everything regardless of response
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            setAuthUser(null);
            setToken(null);
            setOnlineUsers([]);
            delete axios.defaults.headers.common['token'];

            // Safely disconnect socket
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }

            if (data.success) {
                toast.success(data.message);
            } else {
                toast.success('Logged out successfully');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Logout failed';
            console.error('Logout error:', error);

            // Still clear everything even if API call fails
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            setAuthUser(null);
            setToken(null);
            setOnlineUsers([]);
            delete axios.defaults.headers.common['token'];

            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }

            toast.success('Logged out successfully');
        }
    };

    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put('/api/auth/update-profile', body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success(data.message);
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Update failed';
            toast.error(message);
        }
    };

    // Check auth on mount only
    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            // Set token header before checking
            axios.defaults.headers.common['token'] = token;

            try {
                const { data } = await axios.get('/api/auth/check-auth');
                if (data.success) {
                    setAuthUser(data.user);
                    connectSocket(data.user);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                const message = error.response?.data?.message || error.message || 'Authentication failed';

                // Only clear token on 401 (unauthorized)
                if (error.response?.status === 401) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                    }
                    setToken(null);
                    delete axios.defaults.headers.common['token'];
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []); // Empty dependency array - only run once on mount

    // Update axios headers when token changes (after login)
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['token'] = token;
        } else {
            delete axios.defaults.headers.common['token'];
        }
    }, [token]);

    // Cleanup socket on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const value = {
        axios,
        authUser,
        isLoading,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};