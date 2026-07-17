const axios = require("axios")
const Job = require("../models/Job")
const {getDataset} = require("../utils/loadDataset")
const User = require("../models/User")
const  {getBestMatch} = require("../utils/recommendationEngine")
const {exec}= require("child_process")
exports.addJob = async ( req,res) => {
    try{
        const {title, company, skillsRequired, description} = req.body
        const job = await Job.create({
            title,
            company,
            skillsRequired,
            description
        })

        res.json({
            message: "Job added succesfully",
            job
        })
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

//save job
exports.saveJob = async (req,res) => {
    try {
        const {
            role,
            matchScore,
            skills
        } = req.body
        const user = await User.findById(req.user.id)
        user.savedJobs = user.savedJobs || []
        const alreadySaved = user.savedJobs.some(
            job => job.role === role
        )
        if (alreadySaved) {
            return res.status(400).json({
                message: "Career already saved"
            })
        }
        user.savedJobs.push({
            role,
            matchScore,
            skills
        })
        await user.save()
        res.json({
            message: "Job saved Successfully",
            savedJobs: user.savedJobs
        })
    } catch (error)
    {
        res.status(500).json({error: error.message})
    }
}

//recommend job based on dataset
exports.recommendJob = async (req, res) => {
    try {   
        const user = await User.findById(req.user.id)
        if (!user) {

            return res.status(404).json({
                message: "User not found"
            })
        }
        const response = await axios.post(
        "http://127.0.0.1:5001/predict",
            {
                skills: (user.skills || []).join(", "),
                qualification: user.qualification,
                experience_level: user.experienceLevel
            }
        )
        const predictionData = response.data
        user.latestCareer = predictionData.predicted_role
        user.topPredictions = predictionData.top_matches
        await user.save()

        res.json({

            recommendedRole:
                predictionData.predicted_role,

            matchScore:
                predictionData.match_score,

            topPredictions:
                predictionData.top_matches

        })
} catch (error) {


    console.log(error.message)

    if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
    }

    res.status(500).json({
        error: "Prediction failed"
    })
}
}
exports.deleteSavedJob = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
        user.savedJobs = user.savedJobs.filter(
        job => job.role !== req.params.role
        )
        await user.save()

        res.json({
            message: "Job removed",
            savedJobs: user.savedJobs
        })

    } catch (error) {

        res.status(500).json({
            error: error.message
        })
    }
}