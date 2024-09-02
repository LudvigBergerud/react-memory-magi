import React, { useEffect, useState } from "react";

import "../styles/LandingPage.css";

function APIAlert(alertAPI) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (alert) {
      setFade(true);

      // ta bort efter 2,5 sekunder
      const fadeTimer = setTimeout(() => {
        setFade(false);
        // debugger;
      }, 5000);

      return () => {
        clearTimeout(fadeTimer);
      };
    }
  }, [alert]);

  useEffect(() => {
    console.log(alertAPI);
  }, []);

  const alertColor = {
    margin: "15px",
    borderRadius: "15px",
    padding: "15px",
    color: "#fff",
    opacity: fade ? 1 : 0,
    transition: "opacity 0.5s ease-out",
    backgroundColor: "#2196F3",
  };

  return <div style={alertColor}>{alertAPI.alert}</div>;
}

export default APIAlert;
