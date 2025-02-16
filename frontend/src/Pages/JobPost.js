import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { getAuth } from "firebase/auth";

function JobPost() {
  const [formData, setFormData] = useState({
    title: "",
    skills: "",
    experience: "",
    employmentType: "",
    description: "",
    location: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("User not authenticated!");
        setLoading(false);
        return;
      }

      const hrId = user.uid;

      console.log("Submitting Job Post for HR:", hrId);

      
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("skills", formData.skills);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("employmentType", formData.employmentType);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("company", formData.company);

      console.log("formdata is :", formDataToSend)

      await axios.post(
        `http://localhost:8000/job-post/${hrId}`,
        formDataToSend, // Sending FormData
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );



      alert("Job Posted Successfully!");
      setFormData({
        title: "",
        skills: "",
        experience: "",
        employmentType: "",
        description: "",
        location: "",
        company: "",
      });
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post the job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom textAlign="center">
            Post a Job
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  variant="outlined"
                  fullWidth
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter job title (e.g., Software Engineer)"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Skills (comma-separated)"
                  variant="outlined"
                  fullWidth
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  placeholder="E.g., JavaScript, React, Node.js"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Experience (Years)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  placeholder="E.g., 2"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Employment Type"
                  variant="outlined"
                  fullWidth
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the job role, responsibilities, and requirements"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Job Location"
                  variant="outlined"
                  fullWidth
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="E.g., New York, Remote"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Company Name"
                  variant="outlined"
                  fullWidth
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Enter company name"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default JobPost;
