import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function MyJobs() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ textAlign: "center", mt: "2rem" }}>
          My Jobs
        </Typography>
      </Container>
    </>
  );
}

export default MyJobs;
