import mongoose from "mongoose";

const followSchema = mongoose.Schema({
    follower:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    following:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamp:true})

export const Follow  = mongoose.model("Follow", followSchema);