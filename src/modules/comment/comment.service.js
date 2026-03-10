import Comment from "../../DB/models/comment.model.js";
import {
  createNotFoundError,
  createForbiddenError,
} from "../../utils/APIErrors.js";

export const createCommentService = async (data) => {
  const comment = await Comment.create(data);
  return comment;
};

export const getTaskCommentsService = async (taskId) => {
  const comments = await Comment.find({ taskId }).populate(
    "createdBy",
    "name email",
  );
  return comments;
};

export const getOneCommentService = async (commentId) => {
  const comment = await Comment.findById(commentId).populate(
    "createdBy",
    "name email",
  );
  if (!comment) {
    throw createNotFoundError("Comment not found");
  }
  return comment;
};

export const updateCommentService = async (commentId, userId, data) => {
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, createdBy: userId },
    { content: data.content },
    { new: true },
  );

  if (!comment) {
    throw createForbiddenError(
      "Not authorized to update this comment or comment not found",
    );
  }

  return comment;
};

export const deleteCommentService = async (commentId, userId) => {
  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    createdBy: userId,
  });

  if (!comment) {
    throw createForbiddenError(
      "Not authorized to delete this comment or comment not found",
    );
  }

  return true;
};