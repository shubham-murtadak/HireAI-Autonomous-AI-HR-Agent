import React from "react";
import "./Homepage.css";
import Navbar from "../Navbar/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
function Homepage() {
  return (
    <>
      <Navbar />
      <Container className="container" maxWidth="lg" bgcolor="primary">
        <div className="left">
          <Typography variant="h2" color="primary">
            Hire.ai
          </Typography>
          <Typography variant="h3" color="initial">
            is an ai company <br /> creating a portal to make <br /> hiring
            process seamless
          </Typography>
          <br />
          <Link to="/jobpost">
            <Button
              variant="outlined"
              sx={{ mr: "1rem" }}
              target="#"
              color="primary"
            >
              Post Job Openning
            </Button>
          </Link>
          <Link to="/findjob">
            <Button variant="outlined" target="#" color="primary">
              Find Job
            </Button>
          </Link>
        </div>
        <div className="right">
          <div className="img">
            <img src="#" alt="alternate" />
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default Homepage;
