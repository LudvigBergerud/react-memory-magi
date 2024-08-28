import React, { useContext, useEffect, useState } from "react";
import RegisterNewUser from "../components/Register";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { AuthContext } from "../contexts/AuthProvider";
import Alerts from "../components/Alerts";

import "../styles/LandingPage.css";

function Landingpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const authHandler = useContext(AuthContext);
  const loginHandler = useFetch();
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
    var loginAttempt = await loginHandler.handleData(
      "https://localhost:7259/login",
      "POST",
      user
    );

    // Aktivera Alert component
    if (loginAttempt !== 200) {
      setAlert({
        // Sätt text: för varning
        text: "Hey, fel lösenord eller email. Försök igen!",
      });

      return;
    }
  };

  // om lyckad == ge token och då syns navbar etc och skicka user till /home
  useEffect(() => {
    if (loginHandler.response.status === 200 && loginHandler.data !== null) {
      authHandler.signIn(loginHandler.data);
      navigate("/home");
    }
  }, [loginHandler.data]);

  return (
    <>
      <div>
        <div className="moveUP">
          <div className="centerMenu">
            <div className="centerContainer">
              <div className="hoverPicture">
                <img
                  className="frontPagePicture"
                  src="../memorymagi-logo.png"
                />
              </div>
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
        </div>
      </div>
    </>
  );
}

export default Landingpage;
