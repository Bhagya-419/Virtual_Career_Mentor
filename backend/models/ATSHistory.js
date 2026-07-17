const mongoose = require("mongoose")
const atsHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    score: Number,
    resumeFile: String,
    matchedSkills: [String],
    missingSkills: [String],
    suggestions: [
    {
        priority: String,
        text: String
    }
],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model(
    "ATSHistory",
    atsHistorySchema
)