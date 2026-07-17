const mongoose=require("mongoose")

const chatHistorySchema=new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

question:String,

answer:String,

resources:[
{
title:String,
url:String,
content:String
}
]

},{timestamps:true})

module.exports=mongoose.model("ChatHistory",chatHistorySchema)