import React from "react";
import { useState, useContext } from "react";
import useLocalStorage from "./useLocalStorage";
import { AuthContext } from "../contexts/AuthProvider";

function usePost(url, obj, method) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState({});
  const [data, setData] = useState(null);
  const localStorageHandler = useLocalStorage();
  const authHandler = useContext(AuthContext);
  let accessToken = null;

  async function createOptions(obj, method) {
    const headers = {
      "Content-Type": "application/json",
    };
    if (accessToken !== null) {
      headers["Authorization"] = `Bearer ${accessToken.accessToken}`;
    }
    return {
      method: method,
      headers: headers,
      body: JSON.stringify(obj),
    };
  }

  async function checkToken() {
    accessToken = await localStorageHandler.getLocalStorage("accessToken");
    //Check that the access token has not expired
    if (accessToken !== null) {
      const timeDiff = Date.now() / 1000 - accessToken.TimeStamp;
      if (timeDiff > accessToken.expiresIn) {
        await refreshToken();
      }
    }

    async function refreshToken() {
      const refresh = { refreshToken: accessToken.refreshToken };
      //Make call to refresh point with refresh token as parameter
      await fetch("https://localhost:7259/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(refresh),
      })
        .then((response) => response.json())
        .then((data) => {
          //Reset the authentication state, which will store the new token in the local storage
          accessToken = data;
          authHandler.signIn(data);
        });
    }
  }

  async function saveData(url, obj, method) {
    await checkToken();
    const options = await createOptions(obj, method);
    setError("");
    setData(null);
    try {
      setLoading(true);
      const apiResponse = await fetch(url, options);
      setResponse(apiResponse);
      const data = await apiResponse.json();
      setData(data);
    } catch (err) {
      setError(new String(err));
    } finally {
      setLoading(false);
    }
  }

  return { saveData, loading, error, response, data };
}

export default usePost;
