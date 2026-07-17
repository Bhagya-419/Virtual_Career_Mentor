const Quiz = require("../models/Quiz")
const User = require("../models/User")
const QuizAttempt = require("../models/QuizAttempt")

// Add quiz question (Admin)
exports.addQuestion = async (req, res) => {

    try {

        const { subject,question, options, correctAnswer } = req.body

        const newQuestion = new Quiz({
            subject,
            question,
            options,
            correctAnswer
        })

        await newQuestion.save()

        res.json({
            message: "Question added successfully",
            newQuestion
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}


// Get quiz questions
exports.getQuestions = async (req,res) => {

    try {
        const { subject, questionCount = 10 } = req.query
        const questions = await Quiz.find({
            subject
        }).limit(questionCount)

        res.json(questions)

    } catch(error) {

        res.status(500).json({
            error: error.message
        })
    }
}


// Submit quiz answers
exports.submitQuiz = async (req, res) => {

    try {

        const {
            answers,
            subject,
            questionCount
        } = req.body

        const questions = await Quiz.find({
            subject
        }).limit(questionCount)

        let score = 0

        let results = []

        questions.forEach((q, index) => {

            const isCorrect =
                answers[index] === q.correctAnswer

            if (isCorrect) {
                score++
            }

            results.push({

                question: q.question,

                yourAnswer:
                    answers[index] || "Not Answered",

                correctAnswer:
                    q.correctAnswer,

                isCorrect

            })

        })

        const percentage = Math.round(
            (score / questionCount) * 100
        )

        const user = await User.findById(
            req.user.id
        )

        user.quizScore = score

        await user.save()

        await QuizAttempt.create({

            userId: req.user.id,

            subject,

            score,

            totalQuestions: questionCount,

            percentage

        })

        res.json({

            message: "Quiz submitted",

            score,

            percentage,

            results

        })

    } catch (error) {

        res.status(500).json({
            error: error.message
        })

    }

}

exports.attemptQuiz = async (req,res) =>{
    try{
        const {answers,subject} = req.body
        let score=0
        for(let ans of answers){
            const question = await Quiz.findById(ans.questionId)
            if(question && question.correctAnswer === ans.selectedOption){
                score++
            }
        }
        const percentage =
            Math.round(
                (score / answers.length) * 100
            )
        const attempt= await QuizAttempt.create({
            userId: req.user.id,
            subject,
            score,
            totalQuestions: answers.length,
            percentage
        })
        res.json({
            message: "Quiz submitted successfully",
            score,
            totalQuestions: answers.length,
            attempt
        })
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

exports.getMyAttempts = async (req,res) => {
    try{
        const attempts = await QuizAttempt
            .find({userId: req.user.id})
            .sort({createdAt: -1})
        res.json(attempts)

    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

exports.getQuizSummary = async(req,res) =>{
    try{
        const attempts = await QuizAttempt.find({
            userId: req.user.id
        })
        if (attempts.length ==0) {
            return res.json({
                message: "No Quiz attempts yet"
            })
        }
        const totalAttempts = attempts.length
        const bestScore = Math.max(
            ...attempts.map(a => a.score)
        )
        const averageScore =
        attempts.reduce((sum,a) => sum + a.score,0)
        /totalAttempts

        res.json({
            totalAttempts,
            bestScore,
            averageScore: averageScore.toFixed(2)
        })
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}