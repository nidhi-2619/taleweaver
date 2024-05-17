import mongoose,{Schema} from "mongoose";
import { ReadingList } from "../models/readingList.model.js";
import { ApiError } from "../utils/ApiError.js";

const createReadingList = async(req, res)=>{
    const {title} = req.body

    if(!title.trim()){
        throw new ApiError(400, "Title is required.")
    }

    const readingList = await ReadingList.create({
        title:title,
    })

    if(!readingList){
        throw new ApiError(500, "Reading List not able to created")
    }

    readingList.creator = req.user._id 
    await readingList.save()

    res.status(200).json({
        "message":"Reading List created successfully!",
        readingList
    })
}

const getReadingList = async(req, res)=>{
    const {title} = req.params

    if(!title.trim()){
        throw new ApiError(400, "Title is missing.")
    }

    const readingList = await ReadingList.find(title)

    if(!readingList){
        throw new ApiError(400, "Reading List does not exist")
    }

    res.status(200).json({
        "message":"Reading List fetched successfully",
        readingList
    })
}

const addStoryToReadingList = async(req, res)=>{
    const {readingListId, storyId} = req.params 

    if(!readingListId || !storyId){
        throw new ApiError(400, "Reading List Id or Story Id is missing.")
    }

    const readingList = await ReadingList.findById(readingListId)
    if(!readingList){
        throw new ApiError(400, "Reading List does not exist")
    }

    if(readingList?.stories?.includes(storyId)){
        throw new ApiError(400, "Story already exists in the Reading List")
    }
    readingList.stories.push(storyId)
    await readingList.save()

    res.status(200).json({
        "message":"Story added to Reading List successfully",
        readingList
    })
}

const removeStoryFromReadingList = async(req, res)=>{
    const {storyId, readingListId} = req.params 

    if(!storyId || !readingListId){
        throw new ApiError(400, "Story Id or Reading List Id is missing.")
    }

    const readingList = await ReadingList.findById(readingListId)
    if(!readingList){
        throw new ApiError(400, "Reading List does not exist")
    }

    if(!readingList.stories?.storyId){
        throw new ApiError(400, "Story does not exists in the reading list")
    }
    readingList.stories.pull(storyId)
    await readingList.save()

    res.status(200).json({
        "message": "Story removed successfully from the reading list"
    })
}

const userReadingList = async(req, res)=>{
    const {userId} = req.params

    if(!userId){
        throw new ApiError(400, "User Id is missing.")
    }

    const readingList = await ReadingList.aggregate([
        {
            $match:{
                creator: new mongoose.Schema.Types.ObjectId(`${userId}`)
            }
        },
        {
            $lookup:{
                from:'users',
                localField:'creator',
                foreignField:'_id',
                as:'creator'
            }
        }
    ])
    if(!readingList){
        throw new ApiError(400, "Reading List does not exist")
    }

    res.status(200).json({
        "message":"Reading List fetched successfully",
        readingList
    })  
}
export {
    createReadingList,
    getReadingList,
    addStoryToReadingList,
    removeStoryFromReadingList,
    // userReadingList,
}