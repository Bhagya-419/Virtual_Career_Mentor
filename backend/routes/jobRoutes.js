const express = require("express")
const router = express.Router()

const protect = require("../middleware/authMiddleware")
const isAdmin = require("../middleware/adminMiddleware")

const {
    addJob,
    recommendJob,
    saveJob,
    deleteSavedJob
} = require("../controllers/jobController")
router.post("/add", protect, isAdmin, addJob)
router.post("/save", protect, saveJob)
router.post("/recommend", protect, recommendJob)
router.delete(
    "/saved/:role",
    protect,
    deleteSavedJob
)
module.exports = router