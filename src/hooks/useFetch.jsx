import React from "react";
import { useState, useContext } from "react";
import useLocalStorage from "./useLocalStorage";
import { AuthContext } from "../contexts/AuthProvider";

function useFetch(url, obj, method) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const options = {
      method: method,
      headers: headers,
    };
    //Only add body to request if it's not a GET-request.
    if (method !== "GET") {
      options.body = JSON.stringify(obj);
    }
    return options;
  }

  async function checkToken() {
    accessToken = await localStorageHandler.getLocalStorage("accessToken");
    //Check that the access token exists
    if (accessToken !== null) {
      const timeDiff = Date.now() / 1000 - accessToken.TimeStamp;
      //Check if the time difference is larger than the amount of seconds that the previous access token was valid for, with a margin of 60 seconds just to be sure.
      if (timeDiff > accessToken.expiresIn - 60) {
        await refreshToken();
      }
    }
  }

  async function refreshToken() {
    const refreshTokenObj = { refreshToken: accessToken.refreshToken };
    const options = await createOptions(refreshTokenObj, "POST");
    //Make call to refresh point with refresh token as parameter
    try {
      const apiResponse = await fetch(
        "https://localhost:7259/refresh",
        options
      );
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        accessToken = data;
        authHandler.signIn(data);
      } else {
        throw new Error(
          `Server responded with status ${apiResponse.status} ${apiResponse.statusText}`
        );
      }
    } catch (error) {
      throw new Error(`Token refresh failed with ${error}`);
    }
  }

  async function handleData(url, method, obj) {
    try {
      await checkToken();
      const options = await createOptions(obj, method);
      setError(null);
      setData(null);
      setLoading(true);
      const apiResponse = await fetch(url, options);
      setResponse(apiResponse);
      const data = await apiResponse.json();
      setData(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return { handleData, loading, error, response, data };
}

export default useFetch;
