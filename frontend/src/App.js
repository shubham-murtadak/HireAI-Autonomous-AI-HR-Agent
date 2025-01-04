import "./App.css";
import CandidateLogin from "./components/CandidateLogin/CandidateLogin";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/why-us" element={<div>Why Us Page</div>} />
          <Route path="/candidate-login" element={<CandidateLogin />} />
          <Route path="/hr-login" element={<div>HR Login Page</div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
