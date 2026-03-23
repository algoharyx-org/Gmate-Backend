import mongoose from "mongoose";
import Comment from "./comment.model.js";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxLength: 100,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
        },

        status: {
            type: String,
            enum: ["to-do", "in-progress", "review", "completed", "important", "upcoming"],
            default: "to-do",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        dueDate: {
            type: Date,
        },

        attachments: [
            {
                url: {
                    type: String,
                    required: true,
                },
                publicId: {
                    type: String,
                    required: true,
                },
                originalName: {
                    type: String,
                    required: true,
                },
                type: {
                    type: String,
                    required: true,
                },
                size: {
                    type: Number,
                    required: true,
                },
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
        toJson: {virtuals:true},
        toObject:{virtuals:true}
    },
);
 
taskSchema.virtual("comments",{
    ref:"Comment",
    localField:"_id",
    foreignField:"task"
}

)


const Task = mongoose.model("Task", taskSchema);

export default Task;
