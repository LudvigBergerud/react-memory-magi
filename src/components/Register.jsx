import React, { useEffect, useState } from "react";
import usePost from "../hooks/usePost";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Alerts from "../components/Alerts";

// hämta onRegister från LandingPage
function RegisterNewUser({ toggleModal }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const createNewUser = usePost();
  const [alert, setAlert] = useState(null);

  const Register = async () => {
    // lägg till username för register senare
    const userData = {
      username,
      email,
      password,
    };

    if (username === "" && email === "" && password === "") {
      setAlert({
        text: "Hey, du saknar antingen en stor bokstav, liten eller något tecken i din registrering",
      });
    } else {
      // POST:a / skapa ny user till Db
      await createNewUser
        .saveData("https://localhost:7259/api/Users/register", userData, "POST")

        .then((response) => {
          //debugger;
          if (response !== null) {
            toggleModal();
          } else {
            console.error("Registrering failed");
          }
        });
    }
  };

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
        <Alerts alert={alert} />
      </div>
      <div>
        <p>Email måste ha: @</p>
        <p>Lösenord måste ha en 'STORBOKSTAV' </p>
        <p>
          Lösenord måste ha 1 av dessa tecken: ! @ # $ % ^ & * ( ) _ - + ={" "}
          <> ? / "</>"
        </p>
      </div>
    </>
  );
}

export default RegisterNewUser;
