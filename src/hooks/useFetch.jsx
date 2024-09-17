import { useEffect } from "react";
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
      console.log(`Using ${accessToken.accessToken} to make request...`);
    }
    const options = {
      method: method,
      headers: headers,
    };
    //Only add body to request if it's not a GET-request.
    if (method === "POST" || method === "PUT") {
      options.body = JSON.stringify(obj);
    }
    return options;
  }

  async function createExternalOptions(obj, method) {
    return { method: method, body: obj };
  }

  async function checkToken() {
    console.log("Checking token...");
    accessToken = await localStorageHandler.getLocalStorage("accessToken");
    //Check that the access token exists
    if (accessToken !== null) {
      const timeDiff = Date.now() / 1000 - accessToken.TimeStamp;
      //Check if the time difference is larger than the amount of seconds that the previous access token was valid for, with a margin of 60 seconds just to be sure.
      if (timeDiff > accessToken.expiresIn - 60) {
        console.log(
          `${timeDiff} is larger than ${
            accessToken.expiresIn - 60
          } so token has to be refreshed..`
        );

        await refreshToken();
      } else {
        console.log(
          `${timeDiff} is less than ${
            accessToken.expiresIn - 60
          } so token is still valid`
        );
      }
    }
  }

  async function refreshToken() {
    console.log("Refreshing token...");
    const refreshTokenObj = { refreshToken: accessToken.refreshToken };
    console.log(`Old refresh token: ${accessToken.refreshToken}`);
    const options = await createOptions(refreshTokenObj, "POST");
    //Make call to refresh point with refresh token as parameter
    try {
      const apiResponse = await fetch(
        "https://localhost:7259/refresh",
        options
      );
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        console.log(`New refresh token: ${data.refreshToken}`);
        console.log("Is new and old refresh token the same");
        console.log(accessToken.refreshToken === data.refreshToken);
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
    let options = {};
    setError(null);
    setData(null);
    setLoading(true);
    try {
      if (url.includes("localhost")) {
        await checkToken();
        options = await createOptions(obj, method);
      } else {
        options = await createExternalOptions(obj, method);
      }
      const apiResponse = await fetch(url, options);
      setResponse(apiResponse);
      if (apiResponse.ok) {
        const contentType = apiResponse.headers.get("content-type");
        if (contentType !== null) {
          const data = await apiResponse.json();
          setData(data);
        } else {
          setData({});
        }
      } else {
        throw new Error(
          `Request failed with status ${apiResponse.status} ${apiResponse.statusText}. Please contact support or try again later.`
        );
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return { handleData, loading, error, response, data };
}

export default useFetch;
