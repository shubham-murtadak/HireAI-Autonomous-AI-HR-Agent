import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E073F",
      contrastText: "#FFFFFF", // Ensure text is readable on the dark primary color
    },
    secondary: {
      main: "#7A1CAC",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#EBD3F8",
      paper: "#FFFFFF", // Paper components will have a lighter background
    },
    text: {
      primary: "#2E073F",
      secondary: "#7A1CAC",
      dark: "black",
    },
    accent: {
      main: "#AD49E1",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
