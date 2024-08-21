import React, { useState } from "react";

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
    onRegister(userData);
  };

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
