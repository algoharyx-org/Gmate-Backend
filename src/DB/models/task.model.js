import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
        },

        status: {
            type: String,
            enum: ["to-do", "in-progress", "done", "archived"],
            default: "to-do",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
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
                url: String,
                public_id: String,
                name: String,
                resource_type: String,
                format: String,
            },
        ],
    },
    {
        timestamps: true,
    },
);


const Task = mongoose.model("Task", taskSchema);

export default Task;
