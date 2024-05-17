import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
    storyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Story'
    },
    chapterNumber:{
        type: Number,
        default: 1
    },
    title:{
        type: String,
        default: ''
    },
    content:{
        type: String,
        default: ''
    },
    isPublished:{
        type: Boolean,
        default: false
    },
    isDraft:{
        type: Boolean,
        default: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
    
},{timestamps:true})




export const Chapter = mongoose.model("Chapter", chapterSchema);