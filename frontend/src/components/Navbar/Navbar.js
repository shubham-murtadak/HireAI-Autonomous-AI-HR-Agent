import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
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
  IconButton,
  Drawer,
  Box,
} from "@mui/material";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useMediaQuery } from "@mui/material";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const auth = getAuth();

  // Check screen size for responsiveness
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  const toggleDrawer = (state) => {
    setDrawerOpen(state);
  };

  const renderMenuItems = () => (
    <>
      {user ? (
        <>
          <MenuItem onClick={handleClose}>
            <Link to="/" className="nav-link">
              <Button startIcon={<HomeIcon />}>Home</Button>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/myjobs" className="nav-link">
              <Button startIcon={<WorkIcon />}>My Jobs</Button>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Link to="/account" className="nav-link">
              <Button startIcon={<InfoIcon />}>Account Info</Button>
            </Link>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleLogout();
              handleClose();
            }}
          >
            <Button startIcon={<LogoutIcon />}>Sign Out</Button>
          </MenuItem>
        </>
      ) : (
        <MenuItem onClick={handleClose}>
          {/* We can more menu in future */}

          <Link to="/login" className="nav-link">
            <Button variant="outlined">Login / Sign Up</Button>
          </Link>
        </MenuItem>
      )}
    </>
  );

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <img src="./Assets/whiteBgColor.png" height={60} alt="Not found" />
        </Link>
      </div>
      {!isMobile ? (
        <div className="navbar-menus">
          <ul>
            {renderMenuItems()}
            {user && (
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
                            {renderMenuItems()}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <>
          <IconButton
            onClick={() => toggleDrawer(true)}
            className="menu-icon"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => toggleDrawer(false)}
          >
            <Box
              sx={{
                width: 250,
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {renderMenuItems()}
            </Box>
          </Drawer>
        </>
      )}
    </div>
  );
}

export default Navbar;
