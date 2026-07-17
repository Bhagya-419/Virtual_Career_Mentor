const mongoose=require("mongoose")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true 
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum :["user","admin","moderator"]
    },
    resumeFile:{
        type: String
    },
    resumeScore:{
        type: Number,
        default: 0
    },
    quizScore:{
        type: Number,
        default: 0
    },
    savedJobs: [
    {
        role: {
            type: String,
            required: true
        },
        matchScore: {
            type: Number,
            required: true
        },
        skills: [
            String
        ],
        savedAt: {
            type: Date,
            default: Date.now
        }
    }
],
    skills: [String],
    qualification: {
    type: String,
    default: ""
    },
    latestCareer: {
    type: String,
    default: ""
    },
    topPredictions: [
        {
            role: String,
            score: Number
        }
    ],
    experienceLevel: {
        type: String,
        default: "Entry"
    },
    },{timestamps: true})

module.exports = mongoose.model("User",userSchema)