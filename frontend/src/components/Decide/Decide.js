import React from "react";
import { useNavigate } from "react-router-dom"; // Use for navigation
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./decide.css";

function Decide() {
  const navigate = useNavigate(); // For navigation

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the respective path
  };

  return (
    <>
      <nav className="nav">
        <Container maxWidth="lg">
          <Typography variant="h3">Hire.ai</Typography>
        </Container>
      </nav>
      <Container maxWidth="lg" className="decidecontainer">
        <Typography variant="h4" align="center" gutterBottom>
          Choose Your Role
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          gap={4}
        >
          <Card
            className="decideCard"
            onClick={() => handleNavigation("/hr-login")}
            sx={{
              cursor: "pointer",
              width: 250,
              padding: 2,
              textAlign: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h5">HR</Typography>
            </CardContent>
          </Card>
          <Card
            className="decideCard"
            onClick={() => handleNavigation("/candidate-login")}
            sx={{
              cursor: "pointer",
              width: 250,
              padding: 2,
              textAlign: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h5">Student</Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default Decide;
