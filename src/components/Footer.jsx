import React from "react";
import { NavLink } from "react-router-dom";
import { CCircle, InfoCircle, QuestionCircle } from "react-bootstrap-icons";

import "../styles/Footer.css";

function Footer() {
  return (
    <div id="footer-container" sticky="bottom">
      <div id="footer-copyright-wrapper">
        <p>
          <CCircle /> <span>MemoryMagi AB, 2024</span>
        </p>
      </div>
      <div id="footer-links-wrapper">
        <NavLink to="/FAQ">
          <QuestionCircle />
          <span>Vanligt ställda frågor</span>
        </NavLink>
        <NavLink to="/aboutus">
          {" "}
          <InfoCircle />
          <span>Om Oss</span>
        </NavLink>
      </div>
    </div>
  );
}

export default Footer;
