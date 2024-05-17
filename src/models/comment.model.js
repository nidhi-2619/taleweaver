import mongoose from "mongoose";


const commentSchema  = new mongoose.Schema({
    storyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Story'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comment:{
        type: String,
        default:''
    },


},{timestamps:true})

export const Comment = mongoose.model('Comment',commentSchema);