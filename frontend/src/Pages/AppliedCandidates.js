import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

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

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getcandidatesbyjob/${jobId}`);
        const data = response.data;
        
        // Add dummy data for missing fields
        const candidatesWithDummyData = data.map((candidate) => ({
          ...candidate,
          experience: "5 years", // Dummy experience
          rank: Math.floor(Math.random() * 100) + 1, // Random rank between 1 and 100
          date: "2025-02-01", // Dummy date, assuming it's when the candidate applied
        }));

        setCandidates(candidatesWithDummyData);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, [jobId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mt: "1rem", textAlign: "center" }}>
          Candidates for Job ID: {jobId}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidates
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((candidate, index) => (
                      <TableRow hover key={candidate._id}>
                        <TableCell>{candidate.date}</TableCell>
                        <TableCell>{candidate.candidate_name}</TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell align="center">{candidate.experience}</TableCell>
                        <TableCell align="center">{candidate.rank}</TableCell>
                        <TableCell align="center">
                          {candidate.resume_path ? (
                            <Button
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={() => window.open(`http://localhost:8000/${candidate.resume_path}`, "_blank")}
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
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default AppliedCandidates;
