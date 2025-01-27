import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import {
  Avatar,
  Typography,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Grow,
  Button,
} from "@mui/material";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const auth = getAuth();

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
      setUser(currentUser ? currentUser : null);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAvatarClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src="/Assets/WhiteBgColor.png" height={60} />
        </Link>
      </div>
      <div className="navbar-menus">
        <ul>
          {user ? (
            <>
              <li>
                <Avatar
                  src={user.photoURL || ""}
                  alt={user.displayName || "User"}
                  style={{
                    marginTop: "3px",
                    width: 30,
                    height: 30,
                    cursor: "pointer",
                    border: "2px solid black",
                  }}
                  onClick={handleAvatarClick}
                />
                <Popper
                  open={open}
                  anchorEl={anchorEl}
                  role={undefined}
                  transition
                  placement="bottom-end"
                >
                  {({ TransitionProps }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: "right top",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList autoFocusItem={open}>
                            <MenuItem onClick={handleClose}>
                              <Link
                                to="/"
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                              >
                                <Button
                                  startIcon={<HomeIcon fontSize="large" />}
                                >
                                  Home
                                </Button>
                              </Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <Link
                                to="/myjobs"
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                              >
                                <Button startIcon={<WorkIcon />}>
                                  My Jobs
                                </Button>
                              </Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <Link
                                to="/account"
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                              >
                                <Button startIcon={<InfoIcon />}>
                                  Account Info
                                </Button>
                              </Link>
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleLogout();
                                handleClose();
                              }}
                            >
                              <Button startIcon={<LogoutIcon />}>
                                Sign Out
                              </Button>
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">
                  <Button variant="outlined">Login / Sign Up</Button>
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
