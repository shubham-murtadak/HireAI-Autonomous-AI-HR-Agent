import React from "react";
import "./Homepage.css";
import Navbar from "../Navbar/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Footer from "../Footer/Footer";
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
            is an ai company <br /> creating a portel to make <br /> hiring
            process seamless
          </Typography>
          <br />
          <Button variant="outlined" target="#" color="primary">
            Join Now
          </Button>
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
