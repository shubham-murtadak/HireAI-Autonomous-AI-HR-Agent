import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function MyJobs() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Typography variant="h5">My Jobs</Typography>
      </Container>
    </>
  );
}

export default MyJobs;
