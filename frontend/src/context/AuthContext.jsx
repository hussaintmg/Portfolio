import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/auth/user`, { withCredentials: true });
        setUser(res.data);
        
      } catch (err) {
        setUser(null);
        console.log("Token Error: ", err);
      }
    };
    fetchUser();
  }, [apiUrl]);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};