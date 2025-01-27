import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CandidateLogin from "./components/CandidateLogin/CandidateLogin";
import Homepage from "./components/Homepage/Homepage";
import Profile from "./Pages/Profile";
import FindJob from "./Pages/FindJob";
import JobPost from "./Pages/JobPost";
import Account from "./Pages/Account";
import MyJobs from "./Pages/MyJobs";
import Chatbot from "./components/Chatbot/Chatbot";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/why-us" element={<div>Why Us Page</div>} />
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<CandidateLogin />} />
          <Route path="/hr-login" element={<div>HR Login Page</div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/jobpost" element={<JobPost />} />
          <Route path="/findjob" element={<FindJob />} />
          <Route path="/account" element={<Account />} />
          <Route path="/myjobs" element={<MyJobs />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
