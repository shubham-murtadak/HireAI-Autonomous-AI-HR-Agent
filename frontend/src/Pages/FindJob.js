import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Typography, Container, Button, TextField, Grid, Card, Chip, CardContent, CardActions, Box, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Stack, IconButton, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import axios from "axios";
import { auth, storage } from "../Firebase"; // Import Firebase config
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify"; // Optional for notifications

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [experience, setExperience] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [userId, setUserId] = useState(null);


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

  const handleApply = async () => {
    if (!resume) {
      return toast.error("Please upload a resume.");
    }

    // Get the logged-in user ID from Firebase Auth
    const user = auth.currentUser;
    if (!user) {
      return toast.error("You must be logged in to apply.");
    }
    const userId = user.uid; // Firebase user ID
    const jobId = selectedJob._id.$oid; // Ensure this ID is present

    // File Path in Firebase Storage
    const filePath = `jobApplications/${jobId}/${userId}_${resume.name}`;
    const fileRef = ref(storage, filePath);

    // Upload the resume to Firebase Storage
    const uploadTask = uploadBytesResumable(fileRef, resume);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
        toast.error("Error uploading resume.");
      },
      async () => {
        // Get the file URL after upload completes
        const fileURL = await getDownloadURL(fileRef);
        console.log("Resume uploaded at:", fileURL);
        toast.success("Resume uploaded successfully!");

        // Send job application details to the backend
        const formData = new FormData();
        formData.append("candidate_name", candidateName);
        formData.append("email", email);
        formData.append("phone_number", phoneNumber);
        formData.append("linkedin", linkedIn);
        formData.append("experience", experience);
        formData.append("notice_period", noticePeriod);
        formData.append("expected_salary", expectedSalary);
        formData.append("resume_url", fileURL); // Store resume URL instead of file

        try {
          await axios.post(`http://localhost:8000/apply-job/${jobId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Job application submitted successfully!");
          setOpenApplyDialog(false);
        } catch (error) {
          console.error("Error submitting application:", error);
          toast.error("Failed to submit job application.");
        }
      }
    );
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

                  {/* Updated Skills Section with Chip Components */}
                  <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                    {job.skills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        variant="outlined"
                        sx={{ fontSize: "12px" }}
                      />
                    ))}
                  </Box>

                  <Typography variant="body2">
                    Experience: {job.experience} years
                  </Typography>

                  <Typography variant="body2">
                    Employment Type: {job.employmentType}
                  </Typography>

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
            <TextField
              label="Phone Number"
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="LinkedIn Profile"
              fullWidth
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Experience (Years)"
              fullWidth
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Notice Period"
              fullWidth
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Expected Salary"
              fullWidth
              type="number"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
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
