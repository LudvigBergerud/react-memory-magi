import React from "react";
import "../styles/AchievementModal.css"; // Create CSS file for styling
import pokalImg from "../assets/Pokal.png";

const AchievementModal = ({ isOpen, onClose, achievement }) => {
  if (!isOpen) return null;
  return (
    <div className="achievement-modal-overlay">
      <div className="achievement-modal-container">
        <h2>Grattis!</h2>
        <p>Du har låst upp medaljen:</p>
        <div className="achievement-box">
          <img
            src={pokalImg}
            alt={achievement.name}
            className="achievement-image"
          />
          <div className="achievement-text">
            <h3>{achievement.name}</h3>
          </div>
        </div>
        <button className="achievement-close-button" onClick={onClose}>
          Stäng
        </button>
      </div>
    </div>
  );
};

export default AchievementModal;
