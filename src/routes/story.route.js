import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createStory,
    getStory,
    getStories,
    updateStory,
    deleteStory,
    togglePublishStory,
    publishStory
} 
from "../controllers/story.controller.js";
 
const router = Router()

router.use(verifyJWT)

router.route("/")
    .get(getStories)
    .post(upload.single("cover"), createStory)

router.route("/:storyId")
    .get(getStory)
    .patch(updateStory)
    .delete(deleteStory)
    