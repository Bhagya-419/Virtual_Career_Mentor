const express = require("express")
const router = express.Router()

const protect = require("../middleware/authMiddleware")

const {

    chatWithAI,

    getChatHistory,

    deleteChat,

    clearChatHistory

} = require("../controllers/chatController")


router.post(
    "/ask",
    protect,
    chatWithAI
)

router.get(
    "/history",
    protect,
    getChatHistory
)

router.delete(
    "/clear",
    protect,
    clearChatHistory
)

router.delete(
    "/:id",
    protect,
    deleteChat
)

module.exports = router