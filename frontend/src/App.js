import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Quiz from "./pages/Quiz"
import Jobs from "./pages/Jobs"
import Profile from "./pages/Profile"
import Navbar from "./components/Navbar"
import ResumeAnalyzer from "./pages/ResumeAnalyzer"
import Chatbot from "./pages/Chatbot"
import QuizHistory from "./pages/QuizHistory"
import SavedJobs from "./pages/SavedJobs"
import ATSHistory from "./pages/ATSHistory"
import ChatHistory from "./pages/ChatHistory"

function App()
{
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/quiz" element={<Quiz />}/>
        <Route path="/jobs" element={<Jobs />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />}/>
        <Route path="/chatbot" element={<Chatbot />}/>
        <Route path="/quiz-history" element={<QuizHistory />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/ats-history" element={<ATSHistory />}/>
        <Route path="/chat-history"element={<ChatHistory />}/>
      </Routes>
    </Router>
  )
}

export default App