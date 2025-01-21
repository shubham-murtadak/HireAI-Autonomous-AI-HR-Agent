import React from "react";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar/Navbar";

function Profile() {
  return (
    <>
      <Navbar />
      <Typography variant="h4" color="initial">
        This is profile page
      </Typography>
    </>
  );
}

export default Profile;
