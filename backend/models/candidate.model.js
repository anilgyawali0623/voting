import mongoose from 'mongoose';
import User from './user.model.js';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    photo: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    votes: {
      type: Number,
      default: 0, 
    },
      voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", 
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
