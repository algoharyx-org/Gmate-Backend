import expressAsyncHandler from "express-async-handler";
import * as commentService from './comment.service.js';
import { successResponse, createResponse } from '../../utils/APIResponse.js';
import { ApiError } from '../../utils/APIErrors.js';

// @desc     Add a new comment to a task
// @route    POST /comments
// @access   Private
export const addComment = expressAsyncHandler(async (req, res, next) => {
    const { content, taskId, userId } = req.body;
    const creatorId = req.user?._id || userId;

    if (!creatorId) {
        return next(new ApiError(400, "User ID is required"));
    }

    const comment = await commentService.createComment({
        content,
        taskId,
        createdBy: creatorId
    });

    const response = createResponse(comment, "Comment added successfully");
    res.status(201).json(response);
});

// @desc     Get all comments for a specific task
// @route    GET /comments/task/:taskId
// @access   Private
export const getComments = expressAsyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const comments = await commentService.getTaskComments(taskId);
    
    res.status(200).json(successResponse(comments, "Done"));
});

// @desc     Get a single comment by ID
// @route    GET /comments/:commentId
// @access   Private
export const getCommentById = expressAsyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await commentService.getOneComment(commentId);
    
    if (!comment) {
        return next(new ApiError(404, "Comment not found"));
    }

    res.status(200).json(successResponse(comment, "Done"));
});

// @desc     Update an existing comment
// @route    PUT /comments/:commentId
// @access   Private (Owner only)
export const updateComment = expressAsyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const { content, userId } = req.body;
    const creatorId = req.user?._id || userId;

    const comment = await commentService.updateComment(commentId, creatorId, content);
    
    if (!comment) {
        return next(new ApiError(403, "Not authorized or comment not found"));
    }

    res.status(200).json(successResponse(comment, "Comment updated"));
});

// @desc     Delete a comment
// @route    DELETE /comments/:commentId
// @access   Private (Owner only)
export const deleteComment = expressAsyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const { userId } = req.body;
    const creatorId = req.user?._id || userId;

    const comment = await commentService.deleteComment(commentId, creatorId);
    
    if (!comment) {
        return next(new ApiError(403, "Not authorized or comment not found"));
    }

    res.status(200).json(successResponse(null, "Comment deleted"));
}); 