import React from "react";
import "./Homepage.css";
import Navbar from "../Navbar/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Chatbot from "../Chatbot/Chatbot"; // Import Chatbot
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText";

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
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mt: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            textAlign: { xs: "center", md: "left" },
            mt: "3.8rem",
          }}
        >
          <Typography variant="h2" color="primary" gutterBottom>
            <BlurText
              text="Hire.ai"
              delay={150}
              animateBy="words"
              direction="top"
              className="text-2xl mb-8"
            />
          </Typography>
          {/* <Typography variant="h4" color="textPrimary" gutterBottom>
            is an AI company <br /> creating a portal to make <br /> hiring
            process seamless
          </Typography> */}
          <Typography
            variant="h3"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            ⚡ Revolutionizing Hiring with Autonomous AI 🚀 <br />
            Smarter, Faster, Unstoppable.
          </Typography>
          <Typography variant="h5" color="textSecondary">
            The future of recruitment is here—AI-driven, fully automated, and
            built for the next era of hiring.
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Link
              to="/jobpost"
              style={{ textDecoration: "none", marginRight: "1rem" }}
            >
              <Button variant="contained" color="primary">
                Post Job Opening
              </Button>
            </Link>
            <Link to="/findjob" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary">
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
            width: 600,
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

      <Chatbot />
    </>
  );
}

export default Homepage;
