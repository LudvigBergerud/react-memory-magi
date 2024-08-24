import React from "react";

import "../styles/LandingPage.css";

function Alerts({ alert }) {
  if (!alert) {
    return null;
  }

  var opacityValue;
  if (alert) {
    opacityValue = 1;
  } else {
    opacityValue = 0;
  }

  const alertColor = {
    margin: "10px",
    borderRadius: "10px",
    padding: "10px",
    color: "#fff",
    backgroundColor: "#2196F3",
  };

  return (
    <div className="alert" style={alertColor}>
      {alert.text}
    </div>
  );
}

export default Alerts;
