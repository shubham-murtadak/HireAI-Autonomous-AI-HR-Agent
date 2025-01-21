import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import {
  Typography,
  Container,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

function JobPost() {
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Software Engineer",
      company: "TechCorp",
      location: "New York",
      description: "Develop and maintain web applications.",
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "DataSolutions",
      location: "San Francisco",
      description: "Analyze data and create reports.",
    },
    {
      id: 3,
      title: "Product Manager",
      company: "Innovate Inc.",
      location: "Seattle",
      description: "Lead product development and strategy.",
    },
  ]);

  const filteredJobs = jobs.filter(
    (job) =>
      (searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (companyFilter === "" || job.company === companyFilter) &&
      (locationFilter === "" || job.location === locationFilter)
  );

  const clearFilters = () => {
    setSearchQuery("");
    setCompanyFilter("");
    setLocationFilter("");
  };

  return (
    <>
      <Navbar />
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          fontWeight: "600",
          color: "text.primary",
          mt: "2rem",
        }}
      >
        Job Search
      </Typography>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Search Bar */}
        <Box display="flex" alignItems="center" mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search Jobs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginRight: 2 }}
          />
          <Button variant="contained" size="large" onClick={() => {}}>
            Submit
          </Button>
        </Box>

        {/* Filters */}
        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="Filter by Company"
            variant="outlined"
            fullWidth
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          />
          <TextField
            label="Filter by Location"
            variant="outlined"
            fullWidth
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
          <Button
            size="medium"
            variant="outlined"
            color="primary"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Job Cards */}
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card sx={{ p: "1rem" }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="600">
                    {job.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {job.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {<LocationOnOutlinedIcon fontSize="small" />}
                    {job.location}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: "10px", color: "text.primary" }}
                  >
                    {job.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained">
                    Apply Now
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

export default JobPost;
