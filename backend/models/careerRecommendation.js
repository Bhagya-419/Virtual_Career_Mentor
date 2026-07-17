const mongoose = require("mongoose")
const careerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    skills: [String],
    interests: [String],
    quizScore: Number,
    recommendations: [String],
    predictedRole: String,

matchScore: Number,

topPredictions: [
    {
        role: String,
        match_score: Number
    }
],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("CareerRecommendation", careerSchema)