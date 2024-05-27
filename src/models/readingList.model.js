import mongoose from "mongoose";

const readingListSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        default:''
    },
    stories:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Story'
        }
    ],
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

},{timestamp:true})

export const ReadingList = mongoose.model("ReadingList", readingListSchema);