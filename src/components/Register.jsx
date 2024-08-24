import React, { useEffect, useState } from "react";
import usePost from "../hooks/usePost";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

// hämta onRegister från LandingPage
function RegisterNewUser({ toggleModal }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const createNewUser = usePost();

  function Register() {
    // lägg till username för register senare
    const userData = {
      username,
      email,
      password,
    };

    if (username === "" && email === "" && password === "") {
      console.log("Please enter information in these boxes");
      console.log("Email måste innehålla '@'.");
      console.log(
        "Lösnord måste innehålla: ' Stor ' bokstav, ' M I N S T sex tecken ', samt en Special symbol: !''#¤%&"
      );
      // Gör någon banner senare för pop up eller ngt för dessa
    } else {
      // POST:a / skapa ny user till Db
      createNewUser
        .saveData("https://localhost:7259/api/Users/register", userData, "POST")
        .then((response) => {
          if (response != "") {
            toggleModal();
          } else {
            console.error("Registrering failed");
          }
        });
    }
  }

  return (
    <>
      <div className="modalComponent">
        <p>Registera era uppgifter</p>
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lösnord"
          value={password}
          onChange={(p) => setPassword(p.target.value)}
        />
        <br />
        <br />
        <button onClick={Register}>Registrera</button>
      </div>
    </>
  );
}

export default RegisterNewUser;
