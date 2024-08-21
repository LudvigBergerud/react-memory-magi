import React from "react";
import "../styles/Navbar.css";
import { NavLink } from "react-router-dom";
import { House, PlusLg, BoxArrowRight } from "react-bootstrap-icons";

function Navbar() {
  return (
    <>
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
            <span> Skapa spel</span>
          </NavLink>
          <NavLink to="#">
            <BoxArrowRight className="icon" /> <span> Logga ut</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default Navbar;
