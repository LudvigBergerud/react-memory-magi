import React, { useContext, useEffect, useState } from "react";
import RegisterNewUser from "../components/Register";
import { useNavigate } from "react-router-dom";
import usePost from "../hooks/usePost";
import { AuthContext } from "../contexts/AuthProvider";
import Alerts from "../components/Alerts";

import "../styles/LandingPage.css";

function Landingpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const authHandler = useContext(AuthContext);
  const loginHandler = usePost();
  const user = { email, password }; // binda till Value

  // skap en toggle för Modal
  const [isModalVisible, setModalVisible] = useState(false);

  // spara username, email, password i en variabel / objekt
  const [newUser, setnewUser] = useState({
    email: "",
    password: "",
  });

  // Hämta objekt från RegisterNewUser component till createUser
  const confirmRegister = (createUser) => {
    setnewUser(createUser);
    console.log("Ny user: ", createUser);
    toggleSignUpModal();
    setModalVisible(false);
  };

  // om toggled = display, annars not
  const toggleSignUpModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLogIn = async () => {
    console.log("Logg into game");

    var loginAttempt = await loginHandler.saveData(
      "https://localhost:7259/login",
      user,
      "POST"
    );

    // Aktivera Alert component
    if (loginAttempt !== 200) {
      setAlert({
        // Sätt text: för varning
        text: "Hey, fel lösenord eller email. Försök igen!",
        type: "danger",
      });
      // Gör timer

      setTimeout(() => {
        setAlert(null);
      }, 3000);

      return;
    }
  };

  // om lyckad == ge token och då syns navbar etc och skicka user till /home
  useEffect(() => {
    if (loginHandler.response.status === 200 && loginHandler.data !== null) {
      authHandler.signIn(loginHandler.data.accessToken);
      navigate("/home");
    }
  }, [loginHandler.data]);

  return (
    <>
      <div>
        <div></div>
      </div>
      <div className="centerMenu">
        <div className="centerContainer">
          <img className="frontPagePicture" src="../memorymagi-logo.png" />
          <div className="centerInputs">
            <input
              type="text"
              placeholder="E mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Gör Register till en Component */}
            <br />
            <br />
            <button onClick={toggleSignUpModal}>Skapa konto</button>{" "}
            <button onClick={handleLogIn}>Logga in</button>
            <Alerts alert={alert} />
          </div>
        </div>
      </div>

      {/*Gör modal som poppar upp och stängs ner vid klick, stopPropagation = bubblar event  */}
      {isModalVisible && (
        <div className="modalOuter" onClick={toggleSignUpModal}>
          <div className="modalInner" onClick={(e) => e.stopPropagation()}>
            {/*Registera = Displaya info från Reg- comp */}
            <RegisterNewUser
              toggleModal={toggleSignUpModal}
              onRegister={confirmRegister}
            />
            <button onClick={toggleSignUpModal}>X</button>{" "}
          </div>
        </div>
      )}
    </>
  );
}

export default Landingpage;
