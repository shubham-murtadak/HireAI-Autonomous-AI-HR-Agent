import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import GoogleIcon from "@mui/icons-material/Google";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { app } from "../../Firebase";
import "./CandidateLogin.css";

function CandidateLogin() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      // Optionally, display an error message to the user
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout Error:", error.message);
      // Optionally, display an error message to the user
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      if (currentUser) {
        console.log(`Hello, ${currentUser.email}`);
      } else {
        console.log("No user logged in");
      }
    });

    return unsubscribe; // Cleanup subscription on component unmount
  }, [auth]);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" className="login-container">
        <Typography variant="h3" className="title">
          Get Started
        </Typography>
        <div className="auth-buttons">
          {!user ? (
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              className="auth-btn"
              onClick={handleSignIn}
            >
              Login/Sign up with Google
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              className="auth-btn"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </Container>
    </>
  );
}

export default CandidateLogin;
