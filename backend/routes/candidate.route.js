import express from "express";
import {
  createCandidate,
  deleteCandidate,
  handlePendingCandidate,
} from "../controllers/candidate.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/create",
  upload.fields([{ name: "image", maxCount: 1 }]),
  verifyToken,
  createCandidate
);

router.delete("/delete/:candidateId", verifyToken, deleteCandidate);

router.put("/pending/:pendingId", verifyToken, handlePendingCandidate);

export default router;
