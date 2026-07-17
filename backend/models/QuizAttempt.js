const mongoose = require("mongoose")

const attemptSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    subject: {
        type: String,
        required: true
    },

    score: Number,

    totalQuestions: Number,

    percentage: Number,

    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model(
    "QuizAttempt",
    attemptSchema
)