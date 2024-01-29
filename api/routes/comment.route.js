import express from "express";
import {
  createComment,
  getVideoComments,
  likeComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getvideocomments/:videoId", getVideoComments);
router.put("/likecomment/:commentId", verifyToken, likeComment);

export default router;
