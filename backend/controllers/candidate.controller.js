import User from "../models/user.model.js";
import PendingCandidate from "../models/pendingCandidate.model.js";
import Candidate from "../models/candidate.model.js";
import VoteList from "../models/voterlist.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createCandidate = async (req, res) => {
  try {
    const { name, description, photo } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


     const imageLocalPath= req.files?.image[0]?.path;

  if (!imageLocalPath ) {
     return res.status(400).json({message:"image path not found"});
  }
const image = await uploadOnCloudinary(imageLocalPath);

    if (isAdmin) {
      const candidate = new Candidate({
        name,
        description,
        photo:image || "",
        createdBy: userId,
        
      });
      await candidate.save();

      return res.status(201).json({
        message: "Candidate created successfully (Admin)",
        candidate,
      });
    } else {
      const existingCandidate = await Candidate.findOne({ createdBy: userId });
      if (existingCandidate) {
        return res
          .status(403)
          .json({ message: "You can only create one candidate" });
      }

      const pendingCandidate = new PendingCandidate({
        name,
        description,
        photo,
        createdBy: userId,
      });
      await pendingCandidate.save();

      return res.status(201).json({
        message: "Candidate submitted for approval",
        pendingCandidate,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (isAdmin) {
      await candidate.deleteOne({ _id: candidate._id });
      return res
        .status(200)
        .json({ message: "Candidate deleted successfully (Admin)" });
    }

    if (String(candidate.createdBy) === userId) {
      await candidate.deleteOne({ _id: candidate._id });
      return res
        .status(200)
        .json({ message: "Candidate deleted successfully" });
    }

    return res
      .status(403)
      .json({ message: "You are not allowed to delete this candidate" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handlePendingCandidate = async (req, res) => {
  try {
    const pendingId = req.params.pendingId;
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admin can approve or reject candidates" });
    }

    const pending = await PendingCandidate.findById(pendingId);
    if (!pending) {
      return res.status(404).json({ message: "Pending candidate not found" });
    }

    const { action } = req.body;

    if (action === "approve") {
      const candidate = new Candidate({
        name: pending.name,
        description: pending.description,
        photo: pending.photo,
        createdBy: pending.createdBy,
        status: "approved",
      });
      await candidate.save();

      await pending.deleteOne({ _id: pending._id });

      return res.status(200).json({
        message: "Candidate approved and added to Candidate collection",
      });
    }

    if (action === "reject") {
      await pending.remove();
      return res
        .status(200)
        .json({ message: "Candidate rejected and removed from pending list" });
    }

    return res
      .status(400)
      .json({ message: "Invalid action. Use 'approve' or 'reject'" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const voteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user.id;

    const existingVoter = await VoteList.findOne({ user: userId });
    if (existingVoter) {
      return res.status(400).json({ message: "you have already voted" });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "candidate not  found" });
    }

    await VoteList.save({
      user: userId,
      candidate: candidateId,
    });

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      {
        $inc: { votes: 1 },
        $push: { voters: userId },
      },
      { new: true }
    ).populate("voters", "username profilePicture");

    res.status(200).json({
      message: "vote sumbitted successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    res.status(500).json({ message: "error in voting" });
  }
};
