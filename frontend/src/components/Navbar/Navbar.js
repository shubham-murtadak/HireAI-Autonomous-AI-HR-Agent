import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Avatar, Typography } from "@mui/material";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const auth = getAuth(); // Initialize Firebase Auth

  // Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  // Check for Authentication State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Typography variant="h3" color="primary">
            Hire.ai
          </Typography>
        </Link>
      </div>
      <div className="navbar-menus">
        <ul>
          {user ? (
            // Show user profile image and logout button when logged in
            <>
              <li>
                <Link to="/profile" style={{ textDecoration: "none" }}>
                  <Avatar
                    src={user.photoURL || ""}
                    alt={user.displayName || "User"}
                    style={{
                      marginTop: "3px",
                      width: 30,
                      height: 30,
                      cursor: "pointer",
                    }}
                  />
                </Link>
              </li>
              <li>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </Button>
              </li>
            </>
          ) : (
            // Show Signup/Login links when not logged in
            <>
              <li>
                <Link to="/login">
                  <Typography variant="h6" color="initial">
                    Login
                  </Typography>
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
