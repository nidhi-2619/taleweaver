import mongoose from "mongoose";
const storyCategories = [
    'horror',
    'young-adult',
    'romance',
    'fiction',
    'non-fiction',
    'sci-fiction',
    'paranomal',
    'contemporary',
    'fantasy',
    'supernatural'
]
const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        enum:storyCategories
    },
    
})

export const Category = mongoose.model('Category',categorySchema);