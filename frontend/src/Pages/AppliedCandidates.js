import Navbar from "../components/Navbar/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useState } from "react";

const columns = [
  { id: "date", label: "Date", minWidth: 150 },
  { id: "name", label: "Name", minWidth: 150 },
  { id: "rank", label: "Rank", minWidth: 100, align: "center" },
  { id: "resume", label: "Resume (PDF)", minWidth: 200, align: "center" },
];

const initialRows = [
  {
    date: "2025-02-01",
    name: "Rahul Sharma",
    rank: 1,
    resume: "https://example.com/resume1.pdf",
  },
  {
    date: "2025-02-02",
    name: "Amit Verma",
    rank: 2,
    resume: "https://example.com/resume2.pdf",
  },
  {
    date: "2025-02-03",
    name: "Priya Singh",
    rank: 3,
    resume: "https://example.com/resume3.pdf",
  },
  { date: "2025-02-04", name: "Neha Patil", rank: 4, resume: null }, // No resume uploaded
];

function AppliedCandidates() {
  const [rows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
          Candidates
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
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell align="center">{row.rank}</TableCell>
                        <TableCell align="center">
                          {row.resume ? (
                            <Button
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={() => window.open(row.resume, "_blank")}
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
              count={rows.length}
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
