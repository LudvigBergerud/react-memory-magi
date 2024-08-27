import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Result.css";
import star from "../assets/Mario-Star.png";

const sampleLeaderboard = [
  { userID: "Glittrande_troll", time: "10:32" },
  { userID: "Stjärnprinsessa", time: "08:55" },
  { userID: "Mystisk_drake", time: "09:12" },
  { userID: "Magisk_fenix", time: "13:22" },
  { userID: "Sagolejon", time: "02:30" },
  { userID: "Lysande_fågel", time: "05:22" },
  { userID: "Skogsälva", time: "06:18" },
  { userID: "Morgondagg", time: "07:40" },
  { userID: "Stjärnkloka", time: "03:45" },
  { userID: "Nattens_herre", time: "04:05" },
  { userID: "Förtrollad_kanin", time: "02:09" },
  { userID: "Ljusets_häxa", time: "01:14" },
  { userID: "Drömtrollkarlen", time: "01:20" },
  { userID: "Skymnings_väktare", time: "11:47" },
];

function Result() {
  const location = useLocation();
  const data = location.state?.data;

  const [leaderboard, setLeaderboard] = useState(sampleLeaderboard);

  useEffect(() => {
    // Sort leaderboard by time (in format "mm:ss") Might change later
    const sortedLeaderboard = [...leaderboard].sort((a, b) => {
      const [aMin, aSec] = a.time.split(":").map(Number);
      const [bMin, bSec] = b.time.split(":").map(Number);
      return aMin * 60 + aSec - (bMin * 60 + bSec);
    });
    setLeaderboard(sortedLeaderboard);
  }, []);

  return (
    <>
      <div className="result-page">
        <div className="result-box">
          <h1 className="result-title">MAGISK PRESTATION!</h1>
          <p className="result-time-text">
            Du klarade det på tiden: {data ? JSON.stringify(data.time) : ""}
          </p>
          <p>Du slog personligt rekord! </p>
          <p>Du är nu på plats [] i världen!</p>
          <p className="leaderboard-title">TOPPLISTA</p>
          <div className="leaderboard-box">
            {leaderboard.map((entry, index) => (
              <div key={index} className="leaderboard-entry">
                <span className="leaderboard-rank">{index + 1}. </span>
                <span className="leaderboard-userID">{entry.userID} </span>
                <span className="leaderboard-time">{entry.time}</span>
              </div>
            ))}
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
