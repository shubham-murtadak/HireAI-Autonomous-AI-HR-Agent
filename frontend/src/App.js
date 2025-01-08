import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CandidateLogin from "./components/CandidateLogin/CandidateLogin";
import Homepage from "./components/Homepage/Homepage";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/why-us" element={<div>Why Us Page</div>} />
          <Route path="/" element={<Homepage />} />
          <Route path="/candidate-login" element={<CandidateLogin />} />
          <Route path="/hr-login" element={<div>HR Login Page</div>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
