const express = require("express")
const router = express.Router()

const protect = require("../middleware/authMiddleware")
const upload = require("../config/multerConfig")
const {uploadResume, analyzeResume,getATSHistory} = require("../controllers/resumeController")
router.post("/upload",protect,upload.single("resume"), uploadResume)
router.post("/analyze", protect, upload.single("resume"),analyzeResume)
router.get("/history", protect,getATSHistory)
module.exports = router