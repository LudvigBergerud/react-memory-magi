import React, { useEffect, useState } from "react";

import "../styles/LandingPage.css";

function Alerts({ alert, resetAlert }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (alert) {
      setFade(true);

      // ta bort efter 2,5 sekunder
      const fadeTimer = setTimeout(() => {
        setFade(false);
      }, 2500);

      return () => {
        clearTimeout(fadeTimer);
      };
    }
  }, [alert, resetAlert]);

  const alertColor = {
    margin: "10px",
    borderRadius: "10px",
    padding: "10px",
    color: "#fff",
    opacity: fade ? 1 : 0,
    transition: "opacity 0.5s ease-out",
    backgroundColor: "#2196F3",
  };

  return <div style={alertColor}>{alert}</div>;
}

export default Alerts;
