import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createStory,
    getStory,
    // getStories,
    getStoriesByCategory,
    updateStory,
    deleteStory,
    togglePublishStory,
    publishStory
} 
from "../controllers/story.controller.js";
 
const router = Router()

// router.use(verifyJWT)

router.route("/")
    .get(getStoriesByCategory)
    .post(upload.single("cover"), createStory)

router.route("/title")
    .get(getStory)
    .patch(updateStory)
    .delete(deleteStory)
    
export default router;    