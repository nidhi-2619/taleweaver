import mongoose,{isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Story } from "../models/story.model.js";
import {Category} from "../models/category.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createStory = async(req,res)=>{
    const {title, description, category} = req.body

    if([title, description, category].some(fields=>fields.trim()===""))
        throw new Error(400, "All fields are required.")

    const storyCoverLocalPath = req.file?.path
    const storyCover = await uploadOnCloudinary(storyCoverLocalPath)
    
    if(!storyCover){
        throw new ApiError(500, "Story cover image upload failed")
    }
    // if(!storyCategories.includes(category)){
    //     throw new ApiError(400, `Category does not exist please choose from `,storyCategories)
    // }
    let storyCategory = await Category.findOne({
        name:category
    })
    if(!storyCategory){
        storyCategory = await Category.create({
            name:category
        })
    }
    const story = await Story.create({
        title:title.toLowerCase(),
        author:req.user?._id,
        description:description,
        category:storyCategory._id,
        cover:storyCover.url,
        createdAt:new Date()
    })

    const storyCreated = await Story.findById(story._id).select("-category")
    
    if(!storyCreated){
        throw new ApiError(500,"Story not able to created")
    }    
    res.status(200).json({
        "message":"Story created successfully!",
        storyCreated,
        category:storyCategory.name
        
    })
}

const getStory = async(req, res)=>{
    let {title} = req.body

    if(!title.trim()){
        throw new ApiError(400, "Title is missing.")
    }
    title = title
    const story = await Story.find({title})

    if(!story){
        throw new ApiError(400, "Story does not exist")
    }

    // add aggregation to the story controller
    // const storyContent = await Story.aggregate([
    //     {
    //         $match:{
    //             title:title
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from:"users",
    //             localField:"author",
    //             foreignField:"_id",
    //             as:"author"
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from:"likes",
    //             localField:"_id",
    //             foreignField:"storyId",
    //             as:"likes"
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from:"views",
    //             localField:"_id",
    //             foreignField:"storyId",
    //             as:"views"
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from:"comments",
    //             localField:"_id",
    //             foreignField:"storyId",
    //             as:"comments"
    //         }
    //     },
    //     {
    //         $addFields:{
    //             likesCount:{
    //                 $size:"$likes"
    //             },
    //             viewsCount:{
    //                 $size:"$views"
    //             },
    //             commentsCount:{
    //                 $size:"$comments"
    //             }

    //         }
    //     },
    //     {
    //         $unwind:"$author"
    //     },
    //     {
    //         $project:{
    //             title:1,
    //             content:1,
    //             coverImage:1,
    //             author:{
    //                 name:1,
    //                 profileImage:1
    //             },
    //             likesCount:1,
    //             viewsCount:1,
    //             commentsCount:1,
    //             createdAt:1,
    //             updatedAt:1
    //         }
    //     }
    // ])
    res.status(200).json({
        "message":"Story fetched successfully",
        story
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

const getStoriesByCategory = async(req, res)=>{
    const {category} = req.query
    if(!category){
        throw new ApiError(400, "Category is missing")
    }
    const stories = await Category.aggregate([
    {
        $match:{
            name:category
        }
        
    },
        {
            $lookup:{
                from:'stories',
                localField:'_id',
                foreignField:'category',
                as:'stories'
            }
        }
    ])
    if(!stories){
        throw new ApiError(400, "Stories does not exist")
    }
    res.status(200).json({
        "message":"Stories fetched successfully",
        stories
    })
}

export {
    createStory,
    getStory,
    getAllStory,
    updateStory,
    deleteStory,
    togglePublishStory,
    publishStory,
    getStoriesByCategory,
}