const express=require("express")
const router = express.Router()
const protect= require("../middleware/authMiddleware")
const isAdmin = require("../middleware/adminMiddleware")

const {addQuestion, getQuestions, submitQuiz, attemptQuiz, getMyAttempts, getQuizSummary} = require("../controllers/quizController")
router.post("/add", protect, isAdmin,addQuestion)
router.get("/questions",protect,getQuestions)
router.post("/submit",protect, submitQuiz)
router.post("/attempt", protect, attemptQuiz)
router.get("/my-attempts", protect, getMyAttempts)
router.get("/summary", protect, getQuizSummary)
module.exports = router
