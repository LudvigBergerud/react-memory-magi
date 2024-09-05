import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { updateUserAchievements } from "../utils/AchievementChecker";
import "../styles/Result.css";
import star from "../assets/Mario-Star.png";
import useFetch from "../hooks/useFetch";

function Result() {
  const location = useLocation();
  const data = location.state?.data
    ? location.state.data
    : { result: { id: 1 } }; //Default if someone didnt get time from game or went to result with URL

  const [sortedLeaderboard, setSortedLeaderboard] = useState([]);
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [placementNumber, setPlacementNumber] = useState(0);

  const fetchUserHandler = useFetch();

  useEffect(() => {
    const fetchUser = async () => {
      await fetchUserHandler.handleData(
        "https://localhost:7259/api/Users/user",
        "GET"
      );
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (fetchUserHandler.data) {
      setUser(fetchUserHandler.data);
    } else {
      console.log("Error fetching user: ", fetchUserHandler.error);
      setUser(null);
    }
  }, [fetchUserHandler.data]);

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve the stored token object from localStorage
      const tokenObjectString = localStorage.getItem("accessToken");
      const tokenObject = tokenObjectString
        ? JSON.parse(tokenObjectString)
        : null;

      // Access the actual string token from the object...
      const accessToken = tokenObject?.accessToken;

      const response = await fetch(
        `https://localhost:7259/api/Result/GetAllResultsWithIncludedData?currentResultId=${data.result.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const responseData =
          (await response.headers.get("Content-Length")) !== "0"
            ? await response.json()
            : {};

        console.log("TEST", responseData);
        const userIds = new Set();
        const sortedResults = [];

        responseData.forEach((result) => {
          if (!userIds.has(result.userId)) {
            userIds.add(result.userId);
            sortedResults.push(result);
          }
        });

        await setResultData(responseData);
        setSortedLeaderboard(sortedResults);

        const currentResult = responseData.find((r) => r.id === data.result.id);
        setTime(currentResult.time);
      } else {
        console.error("Failed to get all results: ", response.error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (user) {
      let counter = 1;
      // Find the placement number based on the userId
      sortedLeaderboard.forEach((entry) => {
        if (entry.userId === user.userId) {
          setPlacementNumber(counter);
          return;
        }
        counter++;
      });
      // If the id is not found, placementNumber is set to 0
      if (counter > sortedLeaderboard.length) {
        setPlacementNumber(0);
      }
    }
  }, [sortedLeaderboard, user]);

  useEffect(() => {
    const fetchAndUpdateAchievements = async () => {
      if (user && resultData) {
        await updateUserAchievements(user, data.result.id);
      }
    };

    fetchAndUpdateAchievements();
  }, [data.result.id, user, resultData]);

  return (
    <>
      <div className="result-page">
        <div className="result-box">
          <h1 className="result-title">MAGISK PRESTATION!</h1>
          <p className="result-time-text">
            Du klarade det på tiden: {time ? JSON.stringify(time) : ""}
          </p>
          <p>
            {placementNumber !== 0
              ? "Du är top " + placementNumber + " i världen!"
              : ""}{" "}
          </p>
          <p className="leaderboard-title">TOPPLISTA</p>

          <div className="leaderboard-box">
            {sortedLeaderboard.map((entry, index) => {
              // Determine if the entry's userID matches the current user's userID
              if (user) {
                const isCurrentUser = entry.userId === user.userId;

                const entryUserName = entry.username;
                // Dynamically set the class name based on the condition
                const entryClass = isCurrentUser
                  ? "leaderboard-entry current-user-result"
                  : "leaderboard-entry";

                return (
                  <div key={index} className={entryClass}>
                    <span className="leaderboard-rank">{index + 1}. </span>
                    <span className="leaderboard-userName">
                      {entryUserName}
                    </span>
                    <span className="leaderboard-time">{entry.time}</span>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="leaderboard-entry">
                    <h1>Loading leaderboard...</h1>
                  </div>
                );
              }
            })}
          </div>
          <div className="result-btn-box">
            <button className="btn-play-again btn btn-success">
              Spela igen
            </button>
            <button className="btn-go-back btn btn-warning">
              Spela annat spel
            </button>
          </div>
        </div>
        <img src={star} className="animated-image image1" alt="Decorative" />
        <img src={star} className="animated-image image2" alt="Decorative" />
      </div>
    </>
  );
}

export default Result;
