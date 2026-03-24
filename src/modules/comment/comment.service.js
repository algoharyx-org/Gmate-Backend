import Comment from '../../DB/models/comment.model.js';
import { 
    createNotFoundError, 
    createForbiddenError 
} from "../../utils/APIErrors.js";

/**
 * @desc    Create a new comment
 * @param   {Object} data - Comment data (content, taskId, createdBy)
 * @returns {Promise<Object>} The created comment
 */
export const createCommentService = async (data) => {
    return await Comment.create(data);
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