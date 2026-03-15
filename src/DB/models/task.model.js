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
            enum: ["todo", "in-progress", "review", "completed" , "important" , "Upcoming"],
            default: "todo",
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
    },
    {
        timestamps: true,

        toJSON: {virtuals:true},
        toObject: {virtuals:true},
    },
);

taskSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
