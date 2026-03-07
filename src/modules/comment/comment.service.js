import { commentModel } from '../../DB/models/comment.model.js';

export const createComment = async (data) => {
    return await commentModel.create(data);
};

export const getTaskComments = async (taskId) => {
    return await commentModel.find({ taskId }).populate('createdBy', 'name email');
};

export const getOneComment = async (commentId) => {
    return await commentModel.findById(commentId).populate('createdBy', 'name email');
};

export const updateComment = async (commentId, userId, content) => {
    return await commentModel.findOneAndUpdate(
        { _id: commentId, createdBy: userId }, 
        { content }, 
        { new: true }
    );
};

export const deleteComment = async (commentId, userId) => {
    return await commentModel.findOneAndDelete({ _id: commentId, createdBy: userId });
};