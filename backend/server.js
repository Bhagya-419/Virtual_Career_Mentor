require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const { loadDataset } = require("./utils/loadDataset")

connectDB()
loadDataset()

const app = express()

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://virtual-career-mentor-frontend.onrender.com"
]

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const quizRoutes = require("./routes/quizRoutes")
const resumeRoutes = require("./routes/resumeRoutes")
const chatRoutes = require("./routes/chatRoutes")
const profileRoutes = require("./routes/profileRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const jobRoutes = require("./routes/jobRoutes")

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/quiz", quizRoutes)
app.use("/api/resume", resumeRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/jobs", jobRoutes)

app.get("/", (req, res) => {
    res.send("Virtual Career Mentor Backend Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})