import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-center" autoClose={2500} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/quiz-history" element={<ProtectedRoute><QuizHistory /></ProtectedRoute>} />
        <Route path="/saved-jobs" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
        <Route path="/ats-history" element={<ProtectedRoute><ATSHistory /></ProtectedRoute>} />
        <Route path="/chat-history" element={<ProtectedRoute><ChatHistory /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App