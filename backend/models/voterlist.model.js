import Candidate from "./candidate.model.js";
import User from "./user.model.js";

import mongoose from "mongoose";
const voterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VoteList = mongoose.model("Vote", voterSchema);
export default VoteList;
