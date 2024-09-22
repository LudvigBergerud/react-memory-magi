import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUserAchievements } from "../utils/AchievementChecker";
import "../styles/Result.css";
import star from "../assets/Mario-Star.png";
import useFetch from "../hooks/useFetch";
import AchievementModal from "../components/AchievementModal";
import achievementImages from "../utils/AchievementImages";
import useLocalStorage from "../hooks/useLocalStorage";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ResultData } = location.state || {};

  const [sortedLeaderboard, setSortedLeaderboard] = useState([]);
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(null);
  const [timePB, setTimePB] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [placementNumber, setPlacementNumber] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);

  const [resultPosted, setResultPosted] = useState(false);
  const [resultBeingPosted, setResultBeingPosted] = useState(false);

  const localStorageHandler = useLocalStorage();

  const fetchUserHandler = useFetch();
  const postResultHandler = useFetch();
  const getAllResultsHandler = useFetch();

  useEffect(() => {
    if (ResultData) {
      setTime(ResultData.time);
    }
  }, [ResultData]);

  //Fetch current user upon render
  useEffect(() => {
    const fetchUser = async () => {
      await fetchUserHandler.handleData(
        "https://localhost:7259/api/Users/user",
        "GET"
      );
    };
    fetchUser();
  }, []);

  //Set user after fetch has completed
  useEffect(() => {
    if (fetchUserHandler.data) {
      setUser(fetchUserHandler.data);
    }
  }, [fetchUserHandler.data]);

  //Handle error on fetching user
  useEffect(() => {
    if (fetchUserHandler.error) {
      console.error(`Error fetching current user ${fetchUserHandler.error}`);
    }
  }, [fetchUserHandler.error]);

  //Set data and local storage upon successful posting of result
  useEffect(() => {
    const handleResultPost = async () => {
      if (postResultHandler.data) {
        setCurrentResult(postResultHandler.data);
        await localStorageHandler.setLocalStorage(
          "latestResult",
          postResultHandler.data
        );
        setResultPosted(true);
        await localStorageHandler.setLocalStorage("PostedResult", true);
        setResultBeingPosted(false);
      }
    };
    handleResultPost();
  }, [postResultHandler.data]);

  //Handle error upon posting result
  useEffect(() => {
    if (postResultHandler.error) {
      console.error("Failed to post result", postResultHandler.error);
      setResultBeingPosted(false);
    }
  }, [postResultHandler.error]);

  //Set data and leaderboard after successful fetch of results
  useEffect(() => {
    if (getAllResultsHandler.data) {
      const userIds = new Set();
      const sortedResults = [];
      getAllResultsHandler.data.forEach((result) => {
        if (!userIds.has(result.userId)) {
          userIds.add(result.userId);
          sortedResults.push(result);
        }
      });

      setResultData(getAllResultsHandler.data);
      setSortedLeaderboard(sortedResults);
    }
  }, [getAllResultsHandler.data]);

  //Handle error upon fetching all results
  useEffect(() => {
    if (getAllResultsHandler.error) {
      console.error("Failed to get all results: ", getAllResultsHandler.error);
    }
  }, [getAllResultsHandler.error]);

  useEffect(() => {
    const postResult = async () => {
      const postedResult =
        (await localStorageHandler.getLocalStorage("PostedResult")) === true;
      const data = await localStorageHandler.getLocalStorage("latestResult");
      if (postedResult && data) {
        setCurrentResult(data);
      }

      if (
        user &&
        ResultData &&
        !resultPosted &&
        !resultBeingPosted &&
        !postedResult
      ) {
        console.log("test");
        setResultBeingPosted(true);

        postResultHandler.handleData(
          "https://localhost:7259/api/Result/Result",
          "POST",
          {
            gameId: ResultData.gameId,
            userId: user.userId,
            time: ResultData.time,
            passed: true,
          }
        );
      }
    };
    postResult();
  }, [user, ResultData]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentResult) {
        console.log("Current:", currentResult);

        getAllResultsHandler.handleData(
          `https://localhost:7259/api/Result/GetAllResultsWithIncludedData?currentResultId=${currentResult.id}`,
          "GET"
        );
      }
    };

    fetchData();
  }, [user, currentResult]);

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
    if (user) {
      sortedLeaderboard.forEach((entry) => {
        if (entry.userId === user.userId) {
          setTimePB(entry.time);
          return;
        }
      });
    }
  }, [sortedLeaderboard, user]);

  useEffect(() => {
    const fetchAndUpdateAchievements = async () => {
      if (user && resultData) {
        const unlockedAchievements = await updateUserAchievements(
          user,
          currentResult
        );
        if (unlockedAchievements.length > 0) {
          setUnlockedAchievements(unlockedAchievements);
          setCurrentAchievementIndex(0);
          setIsModalOpen(true);
        }
      }
    };

    fetchAndUpdateAchievements();
  }, [user, resultData]);

  const handlePlayAgain = () => {
    var gameData = { gameId: currentResult.gameId };
    navigate("/game", { state: { gameData } });
  };

  const handlePlayAnotherGame = () => {
    navigate("/home"); // Navigate to /home
  };

  const handleCloseModal = () => {
    if (currentAchievementIndex < unlockedAchievements.length - 1) {
      // Move to the next achievement in the queue
      setCurrentAchievementIndex(currentAchievementIndex + 1);
    } else {
      // If there are no more achievements in the queue, reset the state
      setUnlockedAchievements([]);
      setCurrentAchievementIndex(0);
      setIsModalOpen(false);
    }
  };

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
              ? "Du är top " +
                placementNumber +
                " i världen med tiden: " +
                timePB
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
            <button
              className="btn-play-again btn btn-success"
              onClick={handlePlayAgain}
            >
              Spela igen
            </button>
            <button
              className="btn-go-back btn btn-warning"
              onClick={handlePlayAnotherGame}
            >
              Spela annat spel
            </button>
          </div>
        </div>
        <img
          src={star}
          className="result-animated-image image1"
          alt="Decorative"
        />
        <img
          src={star}
          className="result-animated-image image2"
          alt="Decorative"
        />
      </div>
      <div>
        {/* Render the modal only if it's open and there are unlocked achievements */}
        {isModalOpen && unlockedAchievements.length > 0 && (
          <AchievementModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            achievement={unlockedAchievements[currentAchievementIndex]}
            images={achievementImages}
          />
        )}
      </div>
    </>
  );
}

export default Result;
