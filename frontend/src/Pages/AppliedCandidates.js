import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { useLocation } from "react-router-dom";

const columns = [
  { id: "date", label: "Date", minWidth: 150 },
  { id: "name", label: "Name", minWidth: 150 },
  { id: "email", label: "Email", minWidth: 200 },
  { id: "experience", label: "Experience", minWidth: 100, align: "center" },
  { id: "rank", label: "Rank", minWidth: 100, align: "center" },
  { id: "resume", label: "Resume (PDF)", minWidth: 200, align: "center" },
];

function AppliedCandidates() {
  const { jobId } = useParams(); // Get jobId from route
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const location = useLocation();
  const jobTitle = location.state?.jobTitle || "Job Candidates"; // Fallback title

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getcandidatesbyjob/${jobId}`);
        const data = response.data;

        const candidatesWithRanking = data.map((candidate, index) => ({
          ...candidate,
          rank: index + 1, 
          date: "2025-02-01",
        }));

        setCandidates(candidatesWithRanking);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, [jobId]);

  // Handle modal open
  const handleOpenResume = (url) => {
    setResumeUrl(url);
    setOpen(true);
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
    setResumeUrl("");
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mt: "1rem", textAlign: "center" }}>
          Candidates for Job ID: {jobTitle}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidates
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((candidate) => (
                      <TableRow hover key={candidate._id}>
                        <TableCell>{candidate.date}</TableCell>
                        <TableCell>{candidate.candidate_name}</TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell align="center">{candidate.experience}</TableCell>
                        <TableCell align="center">{candidate.rank}</TableCell>
                        <TableCell align="center">
                          {candidate.resume_url ? (
                            <Button
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleOpenResume(candidate.resume_url)}
                            >
                              View Resume
                            </Button>
                          ) : (
                            <Typography color="error">No Resume</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[1, 3, 5]}
              component="div"
              count={candidates.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(+event.target.value);
                setPage(0);
              }}
            />
          </Paper>
        </Box>
      </Container>

      {/* Resume Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Resume Preview
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {resumeUrl ? (
            <iframe
              src={resumeUrl}
              width="100%"
              height="600px"
              style={{ border: "none" }}
              title="Resume Preview"
            />
          ) : (
            <Typography color="error">No Resume Available</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AppliedCandidates;
