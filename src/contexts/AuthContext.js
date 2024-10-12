import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null
  });

  useEffect(() => {
    const verifyToken = () => {
      const token = auth.token;
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            console.log('Token expired.');
            logout();
          } else {
            setAuth({
              token,
              isAuthenticated: true,
              loading: false,
              user: { username: decoded.username }
            });
          }
        } catch (error) {
          logout();
        }
      } else {
        setAuth(prevState => ({
          ...prevState,
          isAuthenticated: false,
          loading: false
        }));
      }
    };

    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/admin/login', { username, password });
      const { token, message } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setAuth({
          token,
          isAuthenticated: true,
          loading: false,
          user: { username: decoded.username }
        });
        return { success: true };
      } else {
        return { success: false, message: message || 'Login failed.' };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
