import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Card, CardContent, CardActions, Button, Grid } from "@mui/material";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions Ltd.",
    location: "Mumbai, India",
    description:
      "Looking for a skilled React.js developer with experience in Material-UI.",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "InnovateX",
    location: "Bangalore, India",
    description:
      "Seeking a Node.js developer with expertise in REST APIs and Firebase.",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "AnalyticsPro",
    location: "Remote",
    description:
      "Hiring a Data Analyst skilled in SQL, Python, and Business Intelligence tools.",
  },
];

function MyJobs() {
  const navigate = useNavigate();

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
