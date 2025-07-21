import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo, 
    deleteVideo,
    togglePublishStatus
} 
from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT); //applied to all routes in video routes.

router.route("/").get(getAllVideos);

router.route("/upload").post(
    upload.fields([ 
        {
            name:"video",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    publishAVideo);

router.route("/:videoId").get(getVideoById);
router.route("/:videoId").patch(upload.single("thumbnail"), updateVideo);
router.route("/:videoId").delete(deleteVideo);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);


export default router;