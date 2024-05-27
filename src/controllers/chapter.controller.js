import { Story } from "../models/story.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Chapter } from "../models/chapter.model.js";


const togglePublishAndDraft = async(req, res)=>{
    const {storyId, chapterId} = req.params
    const {isPublished} = req.body
    if(!chapterId || !storyId){
        throw new ApiError(400, "Chapter id  or story id is missing")
    }
    const chapter = await Chapter.findById(chapterId)
    if(!chapter){
        throw new ApiError(400, "Chapter does not exist")
    }
    if(isPublished){
        chapter.isDraft = false
    }
    else{
        chapter.isDraft = true
    }
    await chapter.save()
    res.status(200).json({
        message: "Chapter updated successfully",
        chapter
    })
}

const getChapter = async(req, res)=>{
    const {storyId, chapterId} = req.params
    if(!chapterId || !storyId){
        throw new ApiError(400, "Chapter id or story id is missing")
    }
    const chapter = await Chapter.findOne({
        storyId:storyId,
        _id:chapterId
    })
    if(!chapter){
        throw new ApiError(400, "Chapter or story does not exist")
    }
    res.status(200).json({
        chapter
    })
}

const addChapter = async(req, res)=>{
    const {storyId} = req.params
    const {title, chapterName} = req.body
    
    const chapter = await Chapter.create({
        storyId,
        title,
        chapterName
    })

    const chapterAddedToStory = await Story.aggregate([
        {
            $match: {
                _id: storyId
            }
        },
        {
            $push:{
                chapters:chapter?._id
            }
        }
    ])

    console.log(chapterAddedToStory)
    if (!chapterAddedToStory){
        throw new ApiError(400, "Chapter not added to story")
    }
    res.status(200).json({
        message: "Chapter added successfully",
        chapter
    })
}


const editChapter = async(req, res)=>{
    const {chapterId} = req.params
    const {title, content} = req.body
    if(!chapterId){
        throw new ApiError(400, "Chapter id is missing")
    }
    const chapter = await Chapter.findById(chapterId)
    if(!chapter){
        throw new ApiError(400, "Chapter does not exist")
    }
    chapter.title = title
    chapter.content = content
    await chapter.save()
    res.status(200).json({
        message: "Chapter updated successfully",
        chapter
    })
}

const deleteChapter = async(req, res)=>{
    const {storyId, chapterId} = req.params
    if(!chapterId || !storyId){
        throw new ApiError(400, "Chapter id  or story id is missing")
    }
    const story = await Story.findById(storyId)
    if(!story){
        throw new ApiError(400, "Story does not exist")
    }
    const chapter = await Chapter.findById(chapterId)
    if(!chapter){
        throw new ApiError(400, "Chapter does not exist")
    }
    await Chapter.findByIdAndDelete(chapterId)
    
    res.status(200).json({
        message: "Chapter deleted successfully",
        chapter
    })
}



export {
    getChapter,
    togglePublishAndDraft,
    addChapter,
    deleteChapter,
    editChapter
  
}