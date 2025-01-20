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

  const handleSubmit = () => {
    console.log("Form Data Submitted:", formData);
    alert("Job Posted Successfully!");
    // Reset the form
    setFormData({
      title: "",
      description: "",
      location: "",
      company: "",
      resume: null,
    });
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
          {/* Job Title */}
          <TextField
            label="Job Title"
            variant="outlined"
            fullWidth
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {/* Job Description */}
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
          {/* Job Location */}
          <TextField
            label="Job Location"
            variant="outlined"
            fullWidth
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
          {/* Company */}
          <TextField
            label="Company"
            variant="outlined"
            fullWidth
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
          {/* Resume Upload */}
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Resume
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Grid>
            {formData.resume && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Uploaded File: {formData.resume.name}
                </Typography>
              </Grid>
            )}
          </Grid>
          {/* Submit Button */}
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
