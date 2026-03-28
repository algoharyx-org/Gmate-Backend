import Comment from "../../DB/models/comment.model.js";
import Task from "../../DB/models/task.model.js";
import { NOTIFICATION_TYPE } from "../../config/constants.js";
import { dispatchNotification } from "../../utils/dispatchNotification.js";
import {
  createNotFoundError,
  createForbiddenError,
} from "../../utils/APIErrors.js";

export const createCommentService = async (data) => {
  const comment = await Comment.create(data);
  const task = await Task.findById(data.taskId).select(
    "title assignee createdBy project",
  );
  if (!task) {
    return comment;
  }
  const authorId = String(data.createdBy);
  const recipients = new Set();
  if (task.assignee && String(task.assignee) !== authorId) {
    recipients.add(String(task.assignee));
  }
  if (task.createdBy && String(task.createdBy) !== authorId) {
    recipients.add(String(task.createdBy));
  }
  for (const rid of recipients) {
    await dispatchNotification({
      recipientId: rid,
      type: NOTIFICATION_TYPE.TASK_COMMENT,
      title: "New comment on task",
      body: `Someone commented on "${task.title}".`,
      taskId: task._id,
      projectId: task.project,
    });
  }
  return comment;
};

/**
 * @desc    Get all comments for a specific task
 * @param   {String} taskId
 * @returns {Promise<Array>} List of comments
 */
export const getTaskCommentsService = async (taskId) => {
    const comments = await Comment.find({ taskId })
        .populate('createdBy', 'name email');
    return comments;
};

/**
 * @desc    Get single comment by ID
 * @param   {String} commentId
 * @returns {Promise<Object>} The comment
 */
export const getOneCommentService = async (commentId) => {
    const comment = await Comment.findById(commentId)
        .populate('createdBy', 'name email');
    
    if (!comment) {
        throw createNotFoundError("Comment not found");
    }
    
    return comment;
};

/**
 * @desc    Update comment (only by owner)
 * @param   {String} commentId
 * @param   {String} userId
 * @param   {String} content
 * @returns {Promise<Object>} Updated comment
 */
export const updateCommentService = async (commentId, userId, content) => {
    const comment = await Comment.findOneAndUpdate(
        { _id: commentId, createdBy: userId }, 
        { content }, 
        { new: true }
    );

    if (!comment) {
        throw createForbiddenError("Not authorized to update this comment or comment not found");
    }

    return comment;
};

/**
 * @desc    Delete comment (only by owner)
 * @param   {String} commentId
 * @param   {String} userId
 * @returns {Promise<Boolean>}
 */
export const deleteCommentService = async (commentId, userId) => {
    const comment = await Comment.findOneAndDelete({ 
        _id: commentId, 
        createdBy: userId 
    });

    if (!comment) {
        throw createForbiddenError("Not authorized to delete this comment or comment not found");
    }

    return true;
};