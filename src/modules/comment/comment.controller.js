import expressAsyncHandler from "express-async-handler";
import * as commentService from "./comment.service.js";
import { successResponse, createResponse } from "../../utils/APIResponse.js";

// @desc     Add a new comment to a task
// @route    POST /comments
// @access   Private
export const addComment = expressAsyncHandler(async (req, res) => {
  const { content, taskId } = req.body;
  const creatorId = req.user._id;

  const comment = await commentService.createCommentService({
    content,
    taskId,
    createdBy: creatorId,
  });

  res.status(201).json(createResponse(comment, "Comment added successfully"));
});

// @desc     Get all comments for a specific task
// @route    GET /comments/:taskId
// @access   Private
export const getComments = expressAsyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const comments = await commentService.getTaskCommentsService(taskId);
  res
    .status(200)
    .json(successResponse(comments, "Comments retrieved successfully"));
});

// @desc     Get a single comment by ID
// @route    GET /comments/one/:commentId
// @access   Private
export const getCommentById = expressAsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const comment = await commentService.getOneCommentService(commentId);
  res
    .status(200)
    .json(successResponse(comment, "Comment retrieved successfully"));
});

// @desc     Update an existing comment
// @route    PUT /comments/:commentId
// @access   Private (Owner only)
export const updateComment = expressAsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  const comment = await commentService.updateCommentService(
    commentId,
    userId,
    content,
  );
  res
    .status(200)
    .json(successResponse(comment, "Comment updated successfully"));
});

// @desc     Delete a comment
// @route    DELETE /comments/:commentId
// @access   Private (Owner only)
export const deleteComment = expressAsyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  await commentService.deleteCommentService(commentId, userId);
  res.status(200).json(successResponse(null, "Comment deleted successfully"));
});
