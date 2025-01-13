import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import "./Navbar.css";

function Navbar({ user, handleLogout }) {
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Typography variant="h3">Hire.ai</Typography>
      </div>
      <div className="navbar-menus">
        <ul>
          {user ? (
            // Show Logout button when user is logged in
            <li>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </Button>
            </li>
          ) : (
            // Show Signup/Login links when no user is logged in
            <>
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
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
