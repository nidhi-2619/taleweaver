import { Router  } from "express";
import { registerUser,loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { followUser } from "../controllers/follow.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createStory } from "../controllers/story.controller.js";

const router = Router();

router.route("/register").post(
    upload.fields([// accepts array of files
        {
            name:"profilePicture",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)
router.route("/login").post(verifyJWT,loginUser)

export default router;