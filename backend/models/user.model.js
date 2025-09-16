import mongoose from 'mongoose';
import Candidate from './candidate.model.js';
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        '',
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    hasVoted: {
      type: Boolean,
      default: false, 
    },
    votedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate", 
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
