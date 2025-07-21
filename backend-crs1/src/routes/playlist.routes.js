import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createPlaylist,
    deletePlaylist, 
    getPlaylistById,
    updatePlaylist,
    addVideoToPlaylist, 
    removeVideoFromPlaylist,
    getUserPlaylists,
    getPlaylistsByUsername,
} from "../controllers/playlist.controller.js";
const router = Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist);
router.route("/:playlistId").patch(updatePlaylist);
router.route("/:playlistId").delete(deletePlaylist);
router.route("/:playlistId").get(getPlaylistById);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);
router.get("/username/:username", getPlaylistsByUsername);

export default router;