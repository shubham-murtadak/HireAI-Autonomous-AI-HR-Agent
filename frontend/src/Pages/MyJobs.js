import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  Grid,
  Divider,
  Box,
} from "@mui/material";
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
        console.log("Hr id is :", hrId)
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
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mt: "2rem",
            mb: "2rem",
          }}
        >
          My Jobs
        </Typography>
        <Grid container spacing={4}>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id?.toString()}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: 3,
                    borderRadius: "10px",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  {/* Card Header with Job Title */}
                  <CardHeader
                    title={job.title}
                    titleTypographyProps={{
                      variant: "h6",
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }} // Reduce font size
                    sx={{
                      bgcolor: "#f5f5f5",
                      py: 1, // Reduce vertical padding
                      px: 2, // Adjust horizontal padding if needed
                      minHeight: "50px", // Set a smaller min height
                    }}
                  />

                  {/* Gray Divider */}
                  <Divider sx={{ bgcolor: "#d1d1d1" }} />

                  <CardContent>
                    <Typography variant="subtitle1" color="textSecondary">
                      {job.company} - {job.location}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 2,
                        color: "text.secondary",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {job.description}
                    </Typography>
                  </CardContent>

                  {/* View Candidates Button */}
                  <CardActions sx={{ p: 2, justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        bgcolor: "text.primary",
                        "&:hover": { bgcolor: "text.secondary" },
                      }}
                      onClick={() => {
                        const jobId = job._id?.$oid || job._id?.toString();
                        const jobTitle = job.title; // Get job title
                        console.log("Navigating to applied candidates:", { jobId, jobTitle });

                        navigate(`/appliedcandidates/${jobId}`, { state: { jobTitle } });
                      }}
                    >
                      View Candidates
                    </Button>

                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box textAlign="center" sx={{ mt: 4, mx: "auto" }}>
              <Typography variant="h6" color="textSecondary">
                No jobs found for this HR.
              </Typography>
            </Box>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default MyJobs;
