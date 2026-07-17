const User = require("../models/User")
const isAdmin = async (req,res,next) =>{
    try{
        const user = await User.findById(req.user.id)
        if (user.role !=="admin"){
            return res.status(403).json({message: "Admin access only"})
        }
        next()
    }catch(error) {
        res.status(500).json({error: error.message})
    }
}
module.exports=isAdmin