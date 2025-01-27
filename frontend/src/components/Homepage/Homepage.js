import React from "react";
import "./Homepage.css";
import Navbar from "../Navbar/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import Chatbot from "../Chatbot/Chatbot"; // Import Chatbot

function Homepage() {
  return (
    <>
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", md: "row" }, // Responsive layout
          gap: 3,
          mt: 4,
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="h2" color="primary" gutterBottom>
            Hire.ai
          </Typography>
          <Typography variant="h4" color="textPrimary" gutterBottom>
            is an AI company <br /> creating a portal to make <br /> hiring
            process seamless
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Link
              to="/jobpost"
              style={{ textDecoration: "none", marginRight: "1rem" }}
            >
              <Button variant="outlined" color="primary">
                Post Job Opening
              </Button>
            </Link>
            <Link to="/findjob" style={{ textDecoration: "none" }}>
              <Button variant="outlined" color="primary">
                Find Job
              </Button>
            </Link>
          </Box>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="./human_resource.jpg"
            height={350}
            alt="Human Resource Illustration"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </Box>
      </Container>

      {/* Embed the Chatbot component */}
      <Chatbot />
    </>
  );
}

export default Homepage;
