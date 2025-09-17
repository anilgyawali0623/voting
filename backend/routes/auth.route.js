import express from "express";
import { checkAuth, google } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/google", google);
router.get("/check", verifyToken, checkAuth);

export default router;
