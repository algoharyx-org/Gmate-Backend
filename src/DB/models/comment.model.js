import {Mongoose } from "mongoose";
import { Types } from "mongoose";
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
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
},{ timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;