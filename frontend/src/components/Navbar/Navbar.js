import React from "react";
import { Link } from "react-router-dom"; // Import Link

import "./Navbar.css";
function Navbar() {
  return (
    <>
      <div className="navbar">
        <div className="navbar-logo">
          <h1>Hire.ai</h1>
        </div>
        <div className="navbar-menus">
          <ul>
            <li>
              <Link to="/why-us">Why us?</Link> {/* Use 'to' for navigation */}
            </li>
            <li>
              <Link to="/candidate-login">Candidate Login</Link>
            </li>
            <li>
              <Link to="/hr-login">HR Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
