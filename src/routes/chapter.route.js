import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
        getChapter,
        togglePublishAndDraft,
        addChapter,
        deleteChapter,
        editChapter
} from '../controllers/chapter.controller.js'

import { Router } from "express";

const router = Router()

app.use(verifyJWT)

router.route("/:storyId/:chapterId")
        .get(getChapter)
        .patch(editChapter)
        .delete(deleteChapter)

router.route("/:storyId")
    .post(addChapter) 
    
router.route("/:storyId/:chapterId").post(togglePublishAndDraft)    
export default router;