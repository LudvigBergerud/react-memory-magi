import React, { useEffect, useState } from "react";
import Alerts from "../components/Alerts";

function ForgotPassword({ toggleForgottModal }) {
  const [email, setEmail] = useState("");
  const [isModalClosedOrNot, setIsModalClosedOrNot] = useState(false);
  const [alert, setAlert] = useState("");

  const closeTheModalButton = () => {
    if (email.includes("@")) {
      toggleForgottModal(true);
      setIsModalClosedOrNot(true);
    } else {
      setAlert("Hey,din email saknar @. Försök igen!");
      setTimeout(() => setAlert(""), 3000);
    }
  };

  return (
    <>
      <div>
        <div>
          <div>
            <p>
              Skriv in er Email adress - begär hjälp - kolla er inbox direkt!
            </p>
            <input
              id="forgottPasswordInput" // lagt till id
              type="text"
              placeholder="Email adress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {alert !== "" ? <Alerts alert={alert} /> : ""}
            <br />
            <br />
            <button
              id="forgottPasswordButton"
              className="roundButton"
              onClick={closeTheModalButton}
            >
              Begär hjälp
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
