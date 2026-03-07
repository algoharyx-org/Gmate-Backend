import { Schema, model, Types } from 'mongoose';

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User', 
        required: true
    },
    taskId: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, { timestamps: true });

export const commentModel = model('Comment', commentSchema);