import React, { createContext, useEffect, useState, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const localStorageHandler = useLocalStorage();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const accessToken = await localStorageHandler.getLocalStorage(
        "accessToken"
      );
      if (accessToken !== null) {
        setIsAuthenticated(true);
      }
    };
    fetchAccessToken();
  }, []);

  function signIn(token) {
    localStorageHandler.setLocalStorage("accessToken", token);
    setIsAuthenticated(true);
  }

  function signOut() {
    localStorageHandler.removeFromLocalStorage("accessToken");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
