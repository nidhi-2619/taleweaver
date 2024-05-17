import mongoose,{isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model.js";
import { Story } from "../models/story.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createStory = async(req,res)=>{
    const {title,author,content} = req.body

    if([title,author,content].some(fields=>fields.trim()===""))
        throw new Error(400, "All fields are required.")

    const storyCoverLocalPath = req.file?.path
    const storyCover = await uploadOnCloudinary(storyCoverLocalPath)
    
    if(!storyCover){
        throw new ApiError(500, "Story cover image upload failed")
    }

    const story = await Story.create({
        title:title,
        author:author,
        content:content,
        coverImage:storyCover.url,
        createdAt:new Date()
    })

    const storyCreated = await Story.findById(story._id)

    if(!storyCreated){
        throw new ApiError(500,"Story not able to created")
    }    
    res.status(200).json({
        "message":"Story created successfully!",
        storyCreated
    })
}

const getStory = async(req, res)=>{
    const {title} = req.params

    if(!title.trim()){
        throw new ApiError(400, "Title is missing.")
    }

    const story = await Story.find(title)

    if(!story){
        throw new ApiError(400, "Story does not exist")
    }

    // add aggregation to the story controller
    const storyContent = await Story.aggregate([
        {
            $match:{
                title:title
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"author",
                foreignField:"_id",
                as:"author"
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"storyId",
                as:"likes"
            }
        },
        {
            $lookup:{
                from:"views",
                localField:"_id",
                foreignField:"storyId",
                as:"views"
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"storyId",
                as:"comments"
            }
        },
        {
            $addfields:{
                likesCount:{
                    $size:"$likes"
                },
                viewsCount:{
                    $size:"$views"
                },
                commentsCount:{
                    $size:"$comments"
                }

            }
        },
        {
            $unwind:"$author"
        },
        {
            $project:{
                title:1,
                content:1,
                coverImage:1,
                author:{
                    name:1,
                    profileImage:1
                },
                likesCount:1,
                viewsCount:1,
                commentsCount:1,
                createdAt:1,
                updatedAt:1
            }
        }
    ])

    res.status(200).json({
        "message":"Story fetched successfully",
        storyContent
    })
}


const getAllStory = async(req, res)=>{
    // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    let stories;
    await Story.find().forEach(story=>{
        stories.push(story)
    })

    if(!stories){
        throw new ApiError(400, "Story does not exist")
    }

    res.status(200).json({
        "message":"Story fetched successfully",
        stories
    })
}

const publishStory = async(req, res)=>{
    const {title, content} = req.body
}

const updateStory = async(req, res)=>{
    const {storyId} = req.params
    const data = req.body

    if(data.title){
        await Story.findByIdandUpdate({_id:storyId},
            {
                $set:{
                    title:data.title
                }
            }
            )
    }
    const coverLocalPath = req.file?.path;

    if(!coverLocalPath){
        throw new ApiError(400,"cover file is missing")
    }
    const cover = await uploadOnCloudinary(coverLocalPath)

    if(!cover){
        throw new ApiError(500, "Story cover image upload failed")
    }
    const updatedStory = await Story.findByIdAndUpdate(storyId,
        {
            $set:{
                cover:cover.url
            }
            },
            {new:true}
        )

    res.status(200).json({
        "message":"Story Updated Successfully.",
        updatedStory
    })    

}

const deleteStory = async(req, res)=>{
    const {storyId} = req.params 
    await Story.findByIdandDelete(storyId)
    res.status(200).json({
        "message":"Story deleted successfully"
    })

}

const togglePublishStory = async(req, res)=>{
    const {storyId} = req.params

    if(!storyId){
        throw new ApiError(400, "Story id is missing")
    }
    const story = await Story.findById(storyId)
    if(!story){
        throw new ApiError(400, "Story does not exist")
    }
        const updatedStory = await Story.findByIdAndUpdate(storyId,
            {
                $set:{
                isPublished: !story.isPublished
            }
        },
        {new:true}
    )
    let msg= "";
    if(updatedStory.isPublished){
        msg += "Story is published successfully."
    }
    else{
        msg += "Story is unpublished successfully."
    }
    res.status(200).json({
        "message":msg,
        updatedStory
    })
    

}   


export {
    createStory,
    getStory,
    getAllStory,
    updateStory,
    deleteStory,
    togglePublishStory,
    publishStory
}