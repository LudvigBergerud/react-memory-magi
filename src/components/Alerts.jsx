import React, { useEffect, useState } from "react";

import "../styles/LandingPage.css";

function Alerts({ alert }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (alert) {
      setFade(true);

      // ta bort efter 2,5 sekunder
      const fadeTimer = setTimeout(() => {
        setFade(false);
        // debugger;
      }, 2500);

      return () => {
        clearTimeout(fadeTimer);
      };
    }
  }, [alert]);

  const alertColor = {
    margin: "10px",
    borderRadius: "10px",
    padding: "10px",
    color: "#fff",
    opacity: fade ? 1 : 0,
    transition: "opacity 0.5s ease-out",
    backgroundColor: "#2196F3",
  };

  if (!alert) {
    return null;
  }

  return <div style={alertColor}>{alert.text}</div>;
}

export default Alerts;
