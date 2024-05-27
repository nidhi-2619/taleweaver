import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createReadingList,
    getReadingList,
    addStoryToReadingList,
    removeStoryFromReadingList,
    // userReadingList,
}
from "../controllers/readingList.controller.js";

const router = Router();
router.use(verifyJWT)

router.route("/").post(createReadingList)
router.route("/get-reading-list").get(getReadingList)
router.route("/add-stories/:readingListId/:storyId").post(addStoryToReadingList)
router.route("/remove-stories/:readingListId/:storyId").delete()
router.route("/user-reading-list/:userId").get()
// router.route("/")

export default router;