import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Card, CardContent, CardActions, Button, Grid } from "@mui/material";
import { getAuth } from "firebase/auth"; // Firebase Auth import
import axios from "axios";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const auth = getAuth();
        const hrId = auth.currentUser?.uid; // Get HR ID from Firebase
        if (!hrId) {
          console.error("HR ID not found. Please ensure you are logged in.");
          return;
        }

        // Fetch jobs by HR ID from your backend
        const response = await axios.get(
          `http://localhost:8000/getjobsbyhr/${hrId}`
        );
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs for HR:", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{ textAlign: "center", mt: "2rem", mb: "2rem" }}
        >
          My Jobs
        </Typography>
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card
                sx={{
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  bgcolor: "#fff",
                  border: 1,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {job.company} - {job.location}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {job.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mb: "1rem", ml: "0.5rem" }}
                    onClick={() => navigate(`/appliedjobs`)}
                  >
                    View Candidates
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default MyJobs;
