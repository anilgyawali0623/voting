import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import Candidate from "../models/candidate.model.js";

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { candidateId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const candidate = await Candidate.findById(candidateId);
    if (!user || !candidate) {
      return res
        .status(404)
        .json({ message: "User or Candidate does not exist" });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment field is empty" });
    }

    const newComment = new Comment({
      text,
      user: userId,
      candidate: candidateId,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      "user",
      "username profilePicture"
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { candidateId } = req.params;

    const comments = await Comment.find({ candidate: candidateId })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    if (!text) {
      return res.status(400).json({ message: "comment text cannot be empty" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json({ message: "comment not found" });
    }

    if (comment.user.toString() !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this comment" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    let updatedComment;

    if (comment.likes.includes(userId)) {
      updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $pull: { likes: userId },
          $inc: { numberOfLikes: -1 },
        },
        { new: true }
      );
    } else {
      updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $addToSet: { likes: userId },
          $pull: { dislikes: userId },
          $inc: { numberOfLikes: 1 },
        },
        { new: true }
      );
    }

    res.status(200).json({
      message: "Like updated successfully",
      comment: updatedComment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
