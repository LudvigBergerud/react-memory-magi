import React, { useContext, useEffect, useState } from "react";
import "../styles/Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { Dropdown, Modal } from "react-bootstrap";

import useFetch from "../hooks/useFetch";

import {
  House,
  PlusLg,
  BoxArrowRight,
  PersonCircle,
} from "react-bootstrap-icons";

import { AuthContext } from "../contexts/AuthProvider";

function Navbar() {
  const authHandler = useContext(AuthContext);
  const navigate = useNavigate();
  const fetchHandler = useFetch();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState("");

  function handleLogOut() {
    fetchHandler.handleData("https://localhost:7259/api/Users/logout", "POST");
  }

  function handleCloseError() {
    setShowErrorModal(false);
    setError("");
  }

  useEffect(() => {
    if (fetchHandler.response.status === 200) {
      authHandler.signOut();
      navigate("/landingpage");
    } else {
      setError(fetchHandler.error);
      setShowErrorModal(true);
    }
  }, [fetchHandler.response]);

  return (
    <>
      <div id="nav-container" className="fixed-top">
        <div id="brand-wrapper">
          <NavLink
            to="/"
            id="navbar-home-link"
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            {" "}
            <House className="icon" /> <span>Hem</span>
          </NavLink>
        </div>
        {authHandler.isAuthenticated ? (
          <>
            {" "}
            <div id="navlinks-wrapper">
              <NavLink
                to="/create"
                id="navbar-create-link"
                className={({ isActive }) =>
                  isActive ? "active-link" : "inactive-link"
                }
              >
                <PlusLg className="icon" />
                <span>Skapa spel</span>
              </NavLink>
              <NavLink
                to="/profile"
                id="navbar-profile-link"
                className={({ isActive }) =>
                  isActive ? "active-link" : "inactive-link"
                }
              >
                <PersonCircle />
                <span>Profil</span>
              </NavLink>
              <button onClick={handleLogOut} id="navbar-logout-link">
                <BoxArrowRight className="icon" /> <span>Logga ut</span>
              </button>
            </div>
            <Dropdown id="navbar-dropdown">
              <Dropdown.Toggle id="dropdown-toggle">Meny</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/create">
                  {" "}
                  <PlusLg className="icon" />
                  Skapa spel
                </Dropdown.Item>
                <Dropdown.Item href="/profile">
                  {" "}
                  <PersonCircle />
                  Profil
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogOut}>
                  <BoxArrowRight />
                  Logga ut
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : (
          ""
        )}
        {fetchHandler.error !== null ? (
          <Modal show={showErrorModal} onHide={handleCloseError} centered>
            <Modal.Header closeButton>
              <Modal.Title>Fel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Utloggning misslyckades då servern svarade med felkod{" "}
                {fetchHandler.response.status}. <br />
                Ta kontakt med support eller försök igen senare.
              </p>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Navbar;
