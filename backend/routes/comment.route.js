import express from "express";
import {
  addComment,
  getComments,
  deleteComment,
  editComment,
  likeComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
 
const router = express.Router();
router.post("/addcomment/:candidateId", verifyToken, addComment);
router.get("/getcomment/:candidateId", getComments);
router.delete("/deletecomment/:commentId", verifyToken, deleteComment);
router.put("/editcomment/:commentId", verifyToken, editComment);
router.put("/like/:commentId", verifyToken, likeComment);
export default router;
