import React, { useContext, useEffect, useState } from "react";
import "../styles/Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { House, PlusLg, BoxArrowRight } from "react-bootstrap-icons";
import usePost from "../hooks/usePost";
import { AuthContext } from "../contexts/AuthProvider";

function Navbar() {
  const authHandler = useContext(AuthContext);
  const navigate = useNavigate();
  const postHandler = usePost();

  function handleLogOut() {
    postHandler.saveData("https://localhost:7259/logout", {}, "POST");
  }
  //Outommented code to easily test login and logout at the same time.
  //   function handleLogin() {
  //     const user = { email: "user1@email.com", password: "passWord123!" };
  //     postHandler.saveData("https://localhost:7259/login", user, "POST");
  //   }

  //   useEffect(() => {
  //     if (postHandler.response.status === 200 && postHandler.data !== null) {
  //       authHandler.signIn(postHandler.data.accessToken);
  //     }
  //   }, [postHandler.data]);

  useEffect(() => {
    if (postHandler.response.status === 200) {
      authHandler.signOut();
      navigate("/");
    }
  }, [postHandler.response]);

  return (
    <>
      {authHandler.isAuthenticated ? (
        <div id="nav-container">
          <div id="brand-wrapper">
            <NavLink to="Home">
              {" "}
              <House className="icon" /> <span>Hem</span>
            </NavLink>
          </div>
          <div id="navlinks-wrapper">
            <NavLink to="#">
              <PlusLg className="icon" />
              <span>Skapa spel</span>
            </NavLink>
            <a onClick={handleLogOut}>
              <BoxArrowRight className="icon" /> <span>Logga ut</span>
            </a>
          </div>
        </div>
      ) : (
        <>{/* <a onClick={handleLogin}>Log in</a> */}</>
      )}
    </>
  );
}

export default Navbar;
