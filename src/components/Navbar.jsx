import React, { useContext, useEffect, useState } from "react";
import "../styles/Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";

import useFetch from "../hooks/useFetch";

import {
  House,
  PlusLg,
  BoxArrowRight,
  PersonCircle,
  List,
} from "react-bootstrap-icons";

import { AuthContext } from "../contexts/AuthProvider";
import { NavDropdown } from "react-bootstrap";

function Navbar() {
  const authHandler = useContext(AuthContext);
  const navigate = useNavigate();
  const fetchHandler = useFetch();

  function handleLogOut() {
    fetchHandler.handleData("https://localhost:7259/logout", "POST", {});
  }

  useEffect(() => {
    if (fetchHandler.response.status === 200) {
      authHandler.signOut();
      navigate("/landingpage");
    } else {
      /* TODO: IMPLEMENT ERROR HANDLING. */
    }
  }, [fetchHandler.response]);

  return (
    <>
      {/* TODO: IMPLEMENT ERROR HANDLING. */}
      <div id="nav-container" className="fixed-top">
        <div id="brand-wrapper">
          <NavLink to="Home">
            {" "}
            <House className="icon" /> <span>Hem</span>
          </NavLink>
        </div>
        {authHandler.isAuthenticated ? (
          <>
            <div id="navlinks-wrapper">
              <NavLink to="#">
                <PlusLg className="icon" />
                <span>Skapa spel</span>
              </NavLink>
              <NavLink to="/profile">
                <PersonCircle />
                <span>Profil</span>
              </NavLink>
              <a onClick={handleLogOut}>
                <BoxArrowRight className="icon" /> <span>Logga ut</span>
              </a>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Navbar;
