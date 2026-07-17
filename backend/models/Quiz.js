const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    question :{
        type: String,
        required :true
    },
    options: {
        type: [String],
        required: true
    },
    correctAnswer:{
        type: String,
        required: true
    }
})
module.exports = mongoose.model("Quiz", quizSchema)