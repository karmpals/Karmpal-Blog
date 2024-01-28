import express from "express";
import {
  create,
  deletevideo,
  getvideos,
  updatevideo,
} from "../controllers/video.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getvideos", getvideos);
router.delete("/deletevideo/:videoId/:userId", verifyToken, deletevideo);
router.put("/updatevideo/:videoId/:userId", verifyToken, updatevideo);

export default router;
