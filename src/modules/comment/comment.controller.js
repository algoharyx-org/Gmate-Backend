import * as commentService from './comment.service.js';
import { successResponse, createResponse } from '../../utils/APIResponse.js';
import { ApiError } from '../../utils/APIErrors.js'; 

export const addComment = async (req, res, next) => {
    try {
        const { content, taskId, userId } = req.body;
        // بياخد الـ ID من التوكن لو موجود، لو مش موجود بياخده من الـ body عشان التجربة
        const creatorId = req.user?._id || userId;

        if (!creatorId) return next(new ApiError(400, "User ID is required"));

        const comment = await commentService.createComment({
            content,
            taskId,
            createdBy: creatorId 
        });
        
        const response = createResponse(comment, "Comment added successfully");
        return res.status(response.statusCode).json(response);
    } catch (error) {
        next(error); 
    }
};

export const getComments = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const comments = await commentService.getTaskComments(taskId);
        const response = successResponse(comments, "Done");
        return res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

export const getCommentById = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const comment = await commentService.getOneComment(commentId);
        if (!comment) return next(new ApiError(404, "Comment not found"));
        
        const response = successResponse(comment, "Done");
        return res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { content, userId } = req.body;
        const creatorId = req.user?._id || userId;

        const comment = await commentService.updateComment(commentId, creatorId, content);
        if (!comment) return next(new ApiError(403, "Not authorized or comment not found"));
        
        const response = successResponse(comment, "Comment updated");
        return res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.body;
        const creatorId = req.user?._id || userId;

        const comment = await commentService.deleteComment(commentId, creatorId);
        if (!comment) return next(new ApiError(403, "Not authorized or comment not found"));

        const response = successResponse(null, "Comment deleted");
        return res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};