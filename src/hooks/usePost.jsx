import React from "react";
import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

function usePost(url, obj, method) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState({});
  const [data, setData] = useState(null);
  const localStorageHandler = useLocalStorage();

  async function createOptions(obj, method) {
    const headers = {
      "Content-Type": "application/json",
    };
    const accessToken = await localStorageHandler.getLocalStorage(
      "accessToken"
    );
    if (accessToken !== null) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return {
      method: method,
      headers: headers,
      body: JSON.stringify(obj),
    };
  }

  async function saveData(url, obj, method) {
    const options = await createOptions(obj, method);
    console.log(options);
    setError(null);
    setData(null);
    try {
      setLoading(true);
      const apiResponse = await fetch(url, options);
      console.log(apiResponse);
      setResponse(apiResponse);
      const data = await apiResponse.json();
      setData(data);
    } catch (err) {
      setError(String(err)); // new
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return { saveData, loading, error, response, data };
}

export default usePost;
