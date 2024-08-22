import React, { useEffect, useState } from "react";
import RegisterNewUser from "../components/Register";
import { Link } from "react-router-dom";

import "../styles/LandingPage.css";

function Landingpage() {
  // skap en toggle för Modal
  const [isModalVisible, setModalVisible] = useState(false);

  // spara username, email, password i en variabel / objekt
  const [newUser, setnewUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Hämta objekt från RegisterNewUser component till createUser
  const confirmRegister = (createUser) => {
    setnewUser(createUser);

    console.log("Ny user: ", createUser);

    toggleSignUpModal();
    setModalVisible(false);

    // Spara till SQL - använd API.
  };

  // om toggled = display, annars not
  const toggleSignUpModal = () => {
    setModalVisible(!isModalVisible);
  };

  function logInToGame() {
    console.log("Logging into the game page");

    // Checka username, lösenord.

    // Fetcha från API user info

    // Linka till "/" om success.
  }

  return (
    <>
      <div className="centerMenu">
        <div>
          <h1>INSERT PICTURE HERE!</h1>
          <div className="centerInputs">
            <input type="text" placeholder="Användarnamn" />
            <br />
            <br />
            <input type="password" placeholder="Lösenord" />
            {/* Gör Register till en Component */}
            <br />
            <br />
            <button onClick={toggleSignUpModal}>Skapa konto</button>{" "}
            <button onClick={logInToGame}>Logga in</button>
          </div>
        </div>
      </div>

      {/*Gör modal som poppar upp och stängs ner vid klick, stopPropagation = bubblar event  */}
      {isModalVisible && (
        <div className="modalOuter" onClick={toggleSignUpModal}>
          <div className="modalInner" onClick={(e) => e.stopPropagation()}>
            {/*Registera = Displaya info från Reg- comp */}
            <RegisterNewUser onRegister={confirmRegister} />
            <button onClick={toggleSignUpModal}>X</button>{" "}
          </div>
        </div>
      )}
    </>
  );
}

export default Landingpage;
