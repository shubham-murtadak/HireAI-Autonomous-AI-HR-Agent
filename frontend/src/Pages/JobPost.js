import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";
import { getAuth } from "firebase/auth"; // Firebase Auth import

function JobPost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    company: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("User not authenticated!");
        return;
      }

      const hrId = user.uid; // Firebase Unique Auth ID

      console.log("Submitting Job Post for HR:", hrId);

      const response = await axios.post(
        `http://localhost:8000/job-post/${hrId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Job Posted Successfully!");
      setFormData({
        title: "",
        description: "",
        location: "",
        company: "",
      });
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post the job.");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Post a Job
        </Typography>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Job Title"
            variant="outlined"
            fullWidth
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            label="Job Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            label="Job Location"
            variant="outlined"
            fullWidth
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          <TextField
            label="Company"
            variant="outlined"
            fullWidth
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default JobPost;
