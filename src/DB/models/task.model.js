import mongoose from "mongoose";

// Define the schema (blueprint) for a Task in our database
const taskSchema = new mongoose.Schema(
    {
        // The title of the task
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        // Detailed description of what the task involves
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
        },
        // The current progress status of the task
        status: {
            type: String,
            enum: ["to-do", "in-progress", "done", "archived"],
            default: "to-do",
        },
        // Urgency level of the task
        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
        },
        // Reference to the Project this task belongs to
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        // Reference to the User who is assigned to complete this task
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        // Reference to the User who originally created this task
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Optional deadline for the task
        dueDate: {
            type: Date,
        },
    },
    {
        // Automatically manage createdAt and updatedAt timestamps
        timestamps: true,
    },
);

// Create the Mongoose model based on the schema
const Task = mongoose.model("Task", taskSchema);

export default Task;
