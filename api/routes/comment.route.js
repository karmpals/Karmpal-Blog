import express from "express";
import {
  createComment,
  getVideoComments,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getvideocomments/:videoId", getVideoComments);

export default router;
