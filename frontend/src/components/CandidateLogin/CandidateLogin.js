import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import "./CandidateLogin.css";
import { Button } from "@mui/material";

function CandidateLogin() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="login-container">
      <form className="candidate-loginform">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        {!isLogin && (
          <TextField
            id="username"
            type="text"
            label="Username"
            variant="outlined"
            margin="normal"
            fullWidth
          />
        )}
        <TextField
          id="email"
          type="email"
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
        />
        <TextField
          id="password"
          type="password"
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
        />
        {!isLogin && (
          <TextField
            id="confirm-password"
            type="password"
            label="Confirm Password"
            variant="outlined"
            margin="normal"
            fullWidth
          />
        )}
        <div className="candidate-buttons">
          <Button variant="contained" size="large">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
          <Button onClick={toggleForm} size="small">
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CandidateLogin;
