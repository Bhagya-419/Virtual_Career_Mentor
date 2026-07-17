const express = require("express")
const router =express.Router()

const {
    getMyProfile,
    updateProfile
} = require("../controllers/profileController")
const authMiddleware = require("../middleware/authMiddleware")
router.get("/me", authMiddleware, getMyProfile)
router.put("/update", authMiddleware, updateProfile)
module.exports = router