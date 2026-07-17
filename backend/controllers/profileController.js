const User = require("../models/User")

exports.getMyProfile = async(req,res) =>{
try{
    const user = await User.findById(req.user.id)
        .select("-password")
    res.json(user)
} catch(error){
    res.status(500).json({error: error.message})
}
}

exports.updateProfile = async (req,res) => {

    try {

        const {
            skills,
            qualification,
            experienceLevel
        } = req.body

        const user = await User.findByIdAndUpdate(

            req.user.id,

            {
                skills,
                qualification,
                experienceLevel
            },

            {
                new: true
            }

        ).select("-password")

        res.json({

            message: "Profile updated",

            user

        })

    } catch(error) {

        res.status(500).json({
            error: error.message
        })

    }

}