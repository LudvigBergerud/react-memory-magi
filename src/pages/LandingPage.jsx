import React, { useContext, useEffect, useState } from "react";
import RegisterNewUser from "../components/Register";
import { useNavigate } from "react-router-dom";
import usePost from "../hooks/usePost";
import { AuthContext } from "../contexts/AuthProvider";

import "../styles/LandingPage.css";

function Landingpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogIn = () => {
    console.log("Logg into game");

    if (!email || !password) {
      // Gör en pop up eller ngt senare om man skriver in fel email / password
      console.log("Enter email and password");
      return console.log("Fel!!!");
    }

    loginHandler.saveData("https://localhost:7259/login", user, "POST");
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
      <div className="centerMenu">
        <div>
          <h1>INSERT PICTURE HERE!</h1>
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
