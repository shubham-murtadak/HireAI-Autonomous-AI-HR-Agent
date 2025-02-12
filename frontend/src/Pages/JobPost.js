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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      await axios.post(`http://localhost:8000/job-post/${hrId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
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
                />
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Company"
                  variant="outlined"
                  fullWidth
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
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
