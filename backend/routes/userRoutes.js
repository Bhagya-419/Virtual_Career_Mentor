const express = require("express")
const router = express.Router()

const { getProfile, updateScores } = require("../controllers/userController")
const protect = require("../middleware/authMiddleware")

router.get("/profile", protect, getProfile)

router.put("/update-scores", protect, updateScores)

module.exports = router