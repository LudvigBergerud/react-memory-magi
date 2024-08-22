import React from "react";
import { NavLink } from "react-router-dom";

import "../styles/Footer.css";

function Footer() {
  return (
    <div id="footer-container">
      <div id="footer-copyright-wrapper">
        <p>© MemoryMagi AB, 2024</p>
      </div>
      <div id="footer-links-wrapper">
        <NavLink to="/FAQ">Vanligt ställda frågor</NavLink>
        <NavLink to="/aboutus">Om Oss</NavLink>
      </div>
    </div>
  );
}

export default Footer;
