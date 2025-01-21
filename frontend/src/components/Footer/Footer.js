import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import { Button } from "@mui/material";

function Footer() {
  return (
    <>
      <footer>
        <Container maxWidth="lg" className="footermain">
          <div className="footerbottom">
            <Link to="/">
              <Button color="secondary">Home</Button>
            </Link>
            <Link to="/jobpost">
              <Button color="secondary">Post a Job Opening</Button>
            </Link>
            <Link to="/findjob">
              <Button color="secondary">Find a Job</Button>
            </Link>
            <Link to="/why-us">
              <Button color="secondary">Why us?</Button>
            </Link>
          </div>
        </Container>
      </footer>
    </>
  );
}

export default Footer;
