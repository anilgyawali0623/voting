import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "../routes/auth.route.js";
import candidateRoutes from "../routes/candidate.route.js";
import commentRoutes from "../routes/comment.route.js";
dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log("errror");
  });
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/comment", commentRoutes);
