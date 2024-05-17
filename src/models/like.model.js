import mongoose from "mongoose";

const likeSchema  = new mongoose.Schema({
    storyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Story'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isLiked:{
        type: Boolean,
        default: false
    },
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }

},{timestamps:true})

export const Like = mongoose.model('Like',likeSchema);