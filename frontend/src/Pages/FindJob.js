import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import axios from "axios";

function JobPost() {
  // State declarations
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobs, setJobs] = useState([]);
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);

  // Fetch job postings from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getjobs");
        console.log("receieved jobs are :",response.data)
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

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

  // Handle apply button click
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setOpenApplyDialog(true);
  };

  // Handle job application
  // Handle job application
const handleApply = async () => {
  const formData = new FormData();
  formData.append("candidate_name", candidateName);
  formData.append("email", email);
  if (resume) formData.append("resume", resume);

  try {
    // Extract the $oid value from the _id object
    const jobId = selectedJob._id.$oid; // Correctly access the $oid field
    console.log("Selected job id is :", jobId);
    await axios.post(
      `http://localhost:8000/apply-job/${jobId}`, // Pass job ID as part of the URL
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    alert("Job application submitted successfully!");
    setOpenApplyDialog(false); // Close dialog after submission
  } catch (error) {
    console.error("Error applying for job:", error);
    alert("Failed to submit job application.");
  }
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
            <Grid item xs={12} sm={6} md={4} key={job._id}>
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
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleApplyClick(job)}
                  >
                    Apply Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Job Application Dialog */}
      <Dialog open={openApplyDialog} onClose={() => setOpenApplyDialog(false)}>
        <DialogTitle>Apply for Job: {selectedJob?.title}</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            fullWidth
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
            accept=".pdf,.docx,.doc"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApplyDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleApply} color="primary">
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default JobPost;
