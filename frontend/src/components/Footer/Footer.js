import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import { Button } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YoutubeIcon from "@mui/icons-material/YouTube";

function Footer() {
  return (
    <>
      <footer>
        <Container maxWidth="lg" className="footermain">
          <div className="footertop">
            <InstagramIcon color="primary" fontSize="large" />
            <FacebookIcon color="primary" fontSize="large" />
            <YoutubeIcon color="primary" fontSize="large" />
          </div>
          <div className="footerbottom">
            <Link to="/">
              <Button>Home</Button>
            </Link>
            <Link to="/candidate-login">
              <Button>Candidate login</Button>
            </Link>
            <Link to="/hr-login">
              <Button>HR Login</Button>
            </Link>
            <Link to="/why-us">
              <Button>Why us?</Button>
            </Link>
          </div>
        </Container>
      </footer>
    </>
  );
}

export default Footer;
