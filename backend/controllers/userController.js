const User = require("../models/User")

// Get profile
exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password")

        res.json(user)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}


// Update scores
exports.updateScores = async (req, res) => {

    try {

        const { resumeScore, quizScore } = req.body

        const user = await User.findById(req.user.id)

        if (resumeScore !== undefined) user.resumeScore = resumeScore
        if (quizScore !== undefined) user.quizScore = quizScore

        await user.save()

        res.json({
            message: "Scores updated",
            user
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}