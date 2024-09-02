import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Result.css";
import star from "../assets/Mario-Star.png";

function Result() {
  const location = useLocation();
  const data = location.state?.data || { gameId: 1, time: "00:15:55" }; //Remove when we get data from game

  const [leaderboard, setLeaderboard] = useState([]);
  const [sortedLeaderboard, setSortedLeaderboard] = useState(leaderboard);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [placementNumber, setPlacementNumber] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      // Retrieve the stored token object from localStorage
      const tokenObjectString = localStorage.getItem("accessToken");
      const tokenObject = tokenObjectString
        ? JSON.parse(tokenObjectString)
        : null;

      // Access the actual string token from the object...
      const accessToken = tokenObject?.accessToken;

      const response = await fetch("https://localhost:7259/api/Users/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data =
          response.headers.get("Content-Length") !== "0"
            ? await response.json()
            : {};
        await setUser(data);
      } else {
        console.error("Error fetching user: ", response.error);
        await setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      // Retrieve the stored token object from localStorage
      const tokenObjectString = localStorage.getItem("accessToken");
      const tokenObject = tokenObjectString
        ? JSON.parse(tokenObjectString)
        : null;

      // Access the actual string token from the object...
      const accessToken = tokenObject?.accessToken;

      const response = await fetch("https://localhost:7259/api/Users/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data =
          response.headers.get("Content-Length") !== "0"
            ? await response.json()
            : {};
        await setUsers(data);
      } else {
        console.error("Error fetching user: ", response.error);
        await setUsers(null);
      }
    };

    fetchUser();
  }, []);

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
        "https://localhost:7259/api/Result/GetAllResults",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data =
          (await response.headers.get("Content-Length")) !== "0"
            ? await response.json()
            : [];

        // Check if the data is an array
        if (Array.isArray(data) && data.length > 0) {
          // Specify the gameId you want to filter by
          const gameId = 1; // Replace with the actual game ID you want to use

          // Filter the fetched data to include only results for the specified game
          const gameData = await data.filter((r) => r.gameId === gameId);

          // Initialize an empty object to keep track of the best (lowest) time for each user
          const leaderboardMap = {};

          // Process each result from the filtered game data
          gameData.forEach((result) => {
            const { userId, time } = result;

            // Convert the time string to seconds for easy comparison
            const timeInSeconds = timeToSeconds(time);

            // Check if the user already has an entry in the leaderboard map
            // And the time is better than the stored entry
            if (
              !leaderboardMap[userId] ||
              timeInSeconds < leaderboardMap[userId]
            ) {
              // Update the leaderboard map with the lower time
              leaderboardMap[userId] = timeInSeconds;
            }
          });

          // Convert the leaderboard map to an array of objects for easier use
          const leaderboardArray = Object.keys(leaderboardMap).map(
            (userId) => ({
              userId,
              time: secondsToTime(leaderboardMap[userId]),
            })
          );

          // Update the state with the processed leaderboard data
          await setLeaderboard(leaderboardArray);
        } else {
          console.error("Unexpected data format or empty data array");
        }
      } else {
        // Log an error if the response was not successful
        console.error("Failed to get all results: ", response.error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    // Sort leaderboard by time (in format "hh:mm:ss")
    const sortedLeaderboard = [...leaderboard].sort((a, b) => {
      // Convert times to seconds for comparison
      const aSeconds = timeToSeconds(a.time);
      const bSeconds = timeToSeconds(b.time);

      return aSeconds - bSeconds; // Sort in ascending order
    });

    setSortedLeaderboard(sortedLeaderboard);
  }, [leaderboard]);

  //Converts HH:MM:SS to seconds
  function timeToSeconds(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  //Converts seconds back to HH:MM:SS
  function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }

  function getUsernameFromId(id) {
    if (users) {
      const user = users.find((u) => u.userId === id);
      return user.userName;
    }
    return "Please reload the page";
  }

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
        console.log(counter, sortedLeaderboard.length);
        setPlacementNumber(0);
      }
    }
  }, [sortedLeaderboard, user]);

  return (
    <>
      <div className="result-page">
        <div className="result-box">
          <h1 className="result-title">MAGISK PRESTATION!</h1>
          <p className="result-time-text">
            Du klarade det på tiden: {data ? JSON.stringify(data.time) : ""}
          </p>
          <p>
            {placementNumber != 0
              ? "Du är top " + placementNumber + " i världen!"
              : ""}{" "}
          </p>
          <p className="leaderboard-title">TOPPLISTA</p>

          <div className="leaderboard-box">
            {sortedLeaderboard.map((entry, index) => {
              // Determine if the entry's userID matches the current user's userID
              if (user) {
                const isCurrentUser = entry.userId === user.userId;

                const entryUserName = getUsernameFromId(entry.userId);
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
                  <div className="leaderboard-entry">
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
