const User = require("../models/User")
const QuizAttempt = require("../models/QuizAttempt")
const CareerRecommendation = require("../models/careerRecommendation")

exports.getDashboard = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password")

        const quizAttempts = await QuizAttempt.find({
            userId: req.user.id
        }).sort({ createdAt: -1 })

        const latestCareer = await CareerRecommendation
            .findOne({
                userId: req.user.id
            })
            .sort({ createdAt: -1 })

        res.json({
            name: user.name,
            email: user.email,
            skills: user.skills,
            resumeScore: user.resumeScore,
            quizScore: user.quizScore,
            savedJobs: user.savedJobs || [],
            quizAttempts,
        })

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }

}