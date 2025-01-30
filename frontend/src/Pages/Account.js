import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Navbar from "../components/Navbar/Navbar";

function Account() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? currentUser : null);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <Container maxWidth="lg">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="80vh"
          >
            <Typography variant="h5" gutterBottom>
              Please log in to view your profile.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/login"
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt={10}
          p={3}
          borderRadius={2}
          boxShadow={2}
          bgcolor="#ffffff"
        >
          <Avatar
            src={user.photoURL || ""}
            alt={user.displayName || "User"}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            {user.displayName || "User"}
          </Typography>
          <Typography variant="body1" color="text.primary">
            {user.email}
          </Typography>
          <Divider sx={{ my: 3, width: "100%" }} />
          <Box width="100%" textAlign="left">
            <Typography variant="h5" gutterBottom>
              Profile Information
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1" color="text.primary" gutterBottom>
              <strong>UID:</strong> {user.uid}
            </Typography>
            {/* Add additional user info if available */}
            {user.phoneNumber && (
              <Typography variant="body1" color="text.primary" gutterBottom>
                <strong>Phone:</strong> {user.phoneNumber}
              </Typography>
            )}
            {user.metadata?.creationTime && (
              <Typography variant="body1" color="text.primary" gutterBottom>
                <strong>Account Created:</strong> {user.metadata.creationTime}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default Account;
