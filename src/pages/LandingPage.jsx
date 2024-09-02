import React, { useContext, useEffect, useState } from "react";
import RegisterNewUser from "../components/Register";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { AuthContext } from "../contexts/AuthProvider";
import Alerts from "../components/Alerts";
import ForgotPassword from "../components/ForgotPassword";
import APIAlert from "../components/APIAlert";

import "../styles/LandingPage.css";

function Landingpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [alertAPI, setAlertAPI] = useState("");
  const navigate = useNavigate();
  const authHandler = useContext(AuthContext);
  const loginHandler = useFetch();
  const user = { email, password }; // binda till Value

  // skap en toggle för Modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleForgott, setModalVisibleForgott] = useState(false);

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

  //Toggla för Forgot password
  const toggleForgottPassword = () => {
    setModalVisibleForgott(!isModalVisibleForgott);
  };

  const handleLogIn = async () => {
    //  var loginAttempt =
    setAlert("");
    setAlertAPI("");
    await loginHandler.saveData("https://localhost:7259/login", user, "POST");
  };

  // om lyckad == ge token och då syns navbar etc och skicka user till /home
  useEffect(() => {
    if (loginHandler.response.status === 200 && loginHandler.data !== null) {
      authHandler.signIn(loginHandler.data);
      navigate("/home");
    }
  }, [loginHandler.data]);

  useEffect(() => {
    console.log(loginHandler.error);
    console.log(loginHandler.response);
    if (loginHandler.error !== null) {
      setAlertAPI(
        "Vi ber om ursäkt, vi har problem med våra servrar. Vi håller på och undersöker detta!"
      );
    }
  }, [loginHandler.error]);

  useEffect(() => {
    console.log(loginHandler.response);

    if (loginHandler.response.status === 401) {
      setAlert("Hey, fel lösenord eller email. Försök igen!");
    }
  }, [loginHandler.response]);

  return (
    <>
      <div className="videoBackground">
        <video autoPlay loop muted playsInline>
          <source src="../mm_video_konfe.mp4" type="video/mp4" />
        </video>
      </div>
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
                  placeholder="Användarnamn"
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
                <br />
                <br />
                <button className="roundButton" onClick={toggleSignUpModal}>
                  Skapa konto
                </button>{" "}
                <button className="roundButton" onClick={handleLogIn}>
                  Logga in
                </button>
                {alert !== "" ? <Alerts alert={alert} /> : ""}
                {alertAPI !== "" ? <APIAlert alert={alertAPI} /> : ""}
                <br />
                <br />
                <button className="roundButton" onClick={toggleForgottPassword}>
                  Glömt lösenord?{" "}
                </button>
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
                <br />
              </div>
            </div>
          )}

          {/*Gör Forgott password modal: gör som Register */}
          {isModalVisibleForgott && (
            <div className="modalOuter" onClick={toggleForgottPassword}>
              <div className="modalInner" onClick={(f) => f.stopPropagation()}>
                <ForgotPassword toggleForgottModal={toggleForgottPassword} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Landingpage;
