const mongoose = require("mongoose")
const savedJobSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: String,
    description: String,
    company: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("SavedJob", savedJobSchema)