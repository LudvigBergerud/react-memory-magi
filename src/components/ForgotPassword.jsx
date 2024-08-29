import React, { useEffect, useState } from "react";
import Alerts from "../components/Alerts";

function ForgotPassword({ toggleForgottModal }) {
  const [email, setEmail] = useState("");
  const [isModalClosedOrNot, setIsModalClosedOrNot] = useState(false);
  const [alert, setAlert] = useState(null);

  const closeTheModalButton = () => {
    if (email.includes("@")) {
      toggleForgottModal(true);
      setIsModalClosedOrNot(true);
    } else {
      setAlert({
        // Sätt text: för varning
        text: "Hey,din email saknar @. Försök igen!",
      });
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
              type="text"
              placeholder="Email adress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Alerts alert={alert} />
            <br />
            <br />
            <button onClick={closeTheModalButton}>Begär hjälp</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
