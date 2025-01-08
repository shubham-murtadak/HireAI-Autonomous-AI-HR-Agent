import React from "react";
import { Link } from "react-router-dom"; // Import Link

import "./Navbar.css";
import { Typography } from "@mui/material";
function Navbar() {
  return (
    <>
      <div className="navbar">
        <div className="navbar-logo">
          <Typography variant="h3">Hire.ai</Typography>
        </div>
        <div className="navbar-menus">
          <ul>
            <li>
              <Link to="/why-us">
                <Typography variant="h6">Why us?</Typography>
              </Link>
            </li>
            <li>
              <Link to="/candidate-login">
                <Typography variant="h6">Candidate Login</Typography>
              </Link>
            </li>
            <li>
              <Link to="/hr-login">
                <Typography variant="h6">HR Login</Typography>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
