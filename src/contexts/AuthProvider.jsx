import React, { createContext, useEffect, useState, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //Initialize as null to make sure the state is not pre-set to false, which led to authenticated users being redirected to landing page as well.
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const localStorageHandler = useLocalStorage();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const accessToken = await localStorageHandler.getLocalStorage(
        "accessToken"
      );
      setIsAuthenticated(accessToken !== null);
    };
    fetchAccessToken();
  }, []);

  function signIn(tokenObj) {
    const currentDate = Date.now();
    //Get timestamp for when token expires
    tokenObj.TimeStamp = currentDate / 1000;
    localStorageHandler.setLocalStorage("accessToken", tokenObj);
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
