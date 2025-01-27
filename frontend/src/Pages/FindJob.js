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
  // State declarations
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobs] = useState([
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

  // Filter logic
  const filteredJobs = jobs.filter(
    (job) =>
      (searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (companyFilter === "" ||
        job.company.toLowerCase().includes(companyFilter.toLowerCase())) &&
      (locationFilter === "" ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase()))
  );

  // Clear filters function
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
        <Box mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search Jobs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search jobs"
          />
        </Box>

        {/* Filters */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Filter by Company"
              fullWidth
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Filter by Location"
              fullWidth
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={clearFilters}
              sx={{ height: "56px" }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        {/* Job Cards */}
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card sx={{ p: 2, height: "100%" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {job.company}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                    <LocationOnOutlinedIcon fontSize="small" />
                    <Typography variant="body2">{job.location}</Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
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
