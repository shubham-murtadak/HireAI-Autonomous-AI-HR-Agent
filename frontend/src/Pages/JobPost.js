import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
} from "@mui/material";
import axios from "axios";

function JobPost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    company: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({ ...prevState, resume: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("company", formData.company);
    data.append("resume", formData.resume);

    try {
      const response = await axios.post(
        "http://localhost:8000/job-post",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      alert("Job Posted Successfully!");
      setFormData({
        title: "",
        description: "",
        location: "",
        company: "",
        resume: null,
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
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
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
