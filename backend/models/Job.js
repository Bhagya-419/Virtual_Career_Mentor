const mongoose = require("mongoose")

const jobSchema  = new mongoose.Schema({
    title: String,
    company: String,
    skillsRequired: [String],
    description: String
}, {timestamps: true})
module.exports = mongoose.model("Job", jobSchema)