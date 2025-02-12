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
  Slide,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import axios from "axios";

// Transition component for a smooth slide-up effect
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  // Open application dialog when Apply Now is clicked
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setOpenApplyDialog(true);
  };

  // Handle job application submission
  const handleApply = async () => {
    const formData = new FormData();
    formData.append("candidate_name", candidateName);
    formData.append("email", email);
    if (resume) formData.append("resume", resume);

    try {
      // Extract the $oid value from the _id object
      const jobId = selectedJob._id.$oid;
      await axios.post(`http://localhost:8000/apply-job/${jobId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Job application submitted successfully!");
      setOpenApplyDialog(false);
      setCandidateName("");
      setEmail("");
      setResume(null);
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to submit job application.");
    }
  };

  return (
    <>
      <Navbar />
      <Typography
        variant="h3"
        sx={{ textAlign: "center", fontWeight: "600", mt: "3rem", mb: "2rem" }}
      >
        Find Your Dream Job
      </Typography>
      <Container maxWidth="lg">
        {/* Search Bar */}
        <Box mb={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search Jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <Grid container spacing={4}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id?.$oid}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  border: "1px solid #d1d1d1", // Gray border
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 3, transform: "translateY(-2px)" },
                }}
              >
                {/* Card Header */}
                <Box
                  sx={{
                    bgcolor: "#f5f5f5",
                    p: 2,
                    borderBottom: "1px solid #d1d1d1",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {job.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {job.company}
                  </Typography>
                </Box>
                {/* Card Content */}
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocationOnOutlinedIcon fontSize="small" />
                    <Typography variant="body2">{job.location}</Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      color: "text.secondary",
                    }}
                  >
                    {job.description}
                  </Typography>
                </CardContent>
                {/* Card Actions */}
                <CardActions sx={{ p: 2, justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ textTransform: "none", width: "100%" }}
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

      {/* Modern Application Form Dialog */}
      <Dialog
        open={openApplyDialog}
        onClose={() => setOpenApplyDialog(false)}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2,
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Apply for {selectedJob?.title}
          <IconButton
            aria-label="close"
            onClick={() => setOpenApplyDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Full Name"
              fullWidth
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="outlined"
              component="label"
              sx={{ textTransform: "none" }}
            >
              {resume ? "Resume Selected" : "Upload Resume"}
              <input
                type="file"
                hidden
                onChange={(e) => setResume(e.target.files[0])}
                accept=".pdf,.docx,.doc"
              />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenApplyDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleApply} variant="contained">
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default JobPost;
