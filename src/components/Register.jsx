import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Alerts from "../components/Alerts";

import APIAlert from "../components/APIAlert";

// hämta onRegister från LandingPage
function RegisterNewUser({ toggleModal }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const createNewUser = useFetch();
  const [alert, setAlert] = useState("");
  const [alertAPI, setAlertAPI] = useState("");

  const Register = async () => {
    const userData = { username, email, password };

    setTimeout(() => setAlert(""), 3000);
    setTimeout(() => setAlertAPI(""), 3000);

    const specialTecken = "!@#$%^&*()_-+=<>?/";

    if (
      username.length <= 3 ||
      !email.includes("@") ||
      password.length <= 5 ||
      !password.split("").some((char) => specialTecken.includes(char))
    ) {
      setAlert(
        "Hey, du saknar antingen en stor bokstav, liten eller något tecken i din registrering"
      );
      return;
    }

    await createNewUser.handleData(
      "https://localhost:7259/api/Users/register",
      "POST",
      userData
    );
  };

  useEffect(() => {
    if (createNewUser.response) {
      if (createNewUser.response.status === 200) {
        console.log(createNewUser.response);
        toggleModal();
      } else if (
        createNewUser.response.status === 404 ||
        createNewUser.response.status === 500 ||
        createNewUser.response.error
      ) {
        console.log(createNewUser.response);
        setAlertAPI(
          "Vi ber om ursäkt, vi har problem med våra servrar. Vi håller på och undersöker detta!"
        );
      }
    }
  }, [createNewUser.response]);

  return (
    <>
      <div className="modalComponent">
        <p>Registera era uppgifter</p>
        <input
          id="username"
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          id="email"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          id="password"
          type="password"
          placeholder="Lösnord"
          value={password}
          onChange={(p) => setPassword(p.target.value)}
        />
        <br />
        <br />
        <button className="roundButton" onClick={Register}>
          Registrera
        </button>
        {alert !== "" ? <Alerts alert={alert} /> : ""}
        {alertAPI !== "" ? <APIAlert alert={alertAPI} /> : ""}
      </div>
      <div></div>
    </>
  );
}

export default RegisterNewUser;
