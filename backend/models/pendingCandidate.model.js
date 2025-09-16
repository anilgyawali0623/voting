import mongoose from "mongoose";
import User from "./user.model.js";
const pendingCandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    photo: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PendingCandidate = mongoose.model(
  "PendingCandidate",
  pendingCandidateSchema
);
export default PendingCandidate;
