import React, { useEffect, useState } from "react";

// hämta onRegister från LandingPage
function RegisterNewUser({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const confirmNewUser = () => {
    const userData = {
      username,
      email,
      password,
    };

    if (username === "" && email === "" && password === "") {
      console.log("Please enter information in these boxes");
    } else {
      //RegisterNewUserFunction(username, email, password);
      onRegister(userData);
    }
  };

  //   function RegisterNewUserFunction(username, email, password) {
  //     fetch("https://localhost:7259/api/Users/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         username: username.inputValue,
  //         email: email.inputValue,
  //         password: password.inputValue,
  //       }),
  //     }),
  //       then((response) => response.json()).then((data) => {
  //         console.log("New user has been registered:", data);
  //       });
  //   }

  return (
    <>
      <div className="modalComponent">
        <p>Registera era uppgifter</p>
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(u) => setUsername(u.target.value)}
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
        <button onClick={confirmNewUser}>Registrera</button>
      </div>
    </>
  );
}

export default RegisterNewUser;
