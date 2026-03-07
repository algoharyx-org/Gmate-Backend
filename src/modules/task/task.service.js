import Task from "../../DB/models/task.model.js";
import Project from "../../DB/models/project.model.js";
import User from "../../DB/models/user.model.js";
import {
    createBadRequestError,
    createForbiddenError,
    createNotFoundError,
} from "../../utils/APIErrors.js";

// Helper function to verify if a user has access to a specific project
const checkProjectAccess = async (userId, projectId) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw createNotFoundError("Project not found");
    }

    // Check if the user is the project owner
    const isOwner = project.owner.toString() === userId;
    // Check if the user exists in the project's member list
    const isMember = project.members.some((m) => m.user.toString() === userId);

    // If the user is neither, deny access
    if (!isOwner && !isMember) {
        throw createForbiddenError(
            "You are not authorized to access tasks for this project"
        );
    }

    return project;
};

// Service to handle creating a new task
export const createTaskService = async (userId, taskData) => {
    const { project: projectId, assignee } = taskData;

    // First, verify the user creating the task actually belongs to the target project
    await checkProjectAccess(userId, projectId);

    // If an assignee is provided, ensure they are also part of the project
    if (assignee) {
        const assigneeUser = await User.findById(assignee);
        if (!assigneeUser) {
            throw createNotFoundError("Assignee not found");
        }

        // Fetch the project to verify the assignee's membership
        const project = await Project.findById(projectId);
        const isAssigneeOwner = project.owner.toString() === assignee;
        const isAssigneeMember = project.members.some(
            (m) => m.user.toString() === assignee
        );

        // Prevent assigning tasks to external users who are not part of this project
        if (!isAssigneeOwner && !isAssigneeMember) {
            throw createBadRequestError("Assignee must be a member of the project");
        }
    }

    // Finally, create the task and set the logged-in user as the creator
    const task = await Task.create({
        ...taskData,
        createdBy: userId,
    });

    return task;
};

// Service to fetch tasks optionally filtered by a specific project
export const getAllTasksService = async (userId, queryOptions = {}) => {
    const { projectId } = queryOptions;
    let filter = {};

    if (projectId) {
        // If a specific project is requested, verify access and filter only those tasks
        await checkProjectAccess(userId, projectId);
        filter.project = projectId;
    } else {
        // Otherwise, fetch tasks across all projects where the user is a member or owner
        const projects = await Project.find({
            $or: [{ owner: userId }, { "members.user": userId }],
        }).select("_id"); // Optimize query by returning only the project IDs

        const projectIds = projects.map((p) => p._id);

        // Criteria: Tasks from the user's projects, tasks created by the user, or tasks assigned to the user
        filter = {
            $or: [
                { project: { $in: projectIds } },
                { createdBy: userId },
                { assignee: userId },
            ],
        };
    }

    // Query the tasks and populate references to show full details of the project, assignee, and creator
    const tasks = await Task.find(filter)
        .populate("project", "title status")
        .populate("assignee", "name email avatar")
        .populate("createdBy", "name email avatar");

    return tasks;
};

// Service to fetch a single task by its ID
export const getTaskByIdService = async (userId, taskId) => {
    // Find task and populate relational fields for a comprehensive response
    const task = await Task.findById(taskId)
        .populate("project", "title status owner members")
        .populate("assignee", "name email avatar")
        .populate("createdBy", "name email avatar");

    if (!task) {
        throw createNotFoundError("Task not found");
    }

    // Ensure the requesting user actually belongs to the task's project before revealing info
    await checkProjectAccess(userId, task.project._id);

    return task;
};

// Service to update a task's details
export const updateTaskService = async (userId, taskId, updateData) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw createNotFoundError("Task not found");
    }

    // Fetch project details and verify the user's access
    const project = await checkProjectAccess(userId, task.project);

    // Role-based permission checks to determine who can edit the task
    const isOwner = project.owner.toString() === userId;
    const isManager = project.members.some(
        (m) => m.user.toString() === userId && m.role === "manager"
    );
    const isCreator = task.createdBy.toString() === userId;
    const isAssignee = task.assignee?.toString() === userId;

    // Only project owners, project managers, the task's original creator, or the currently assigned user can update it
    if (!isOwner && !isManager && !isCreator && !isAssignee) {
        throw createForbiddenError("You are not authorized to update this task");
    }

    // If the update assigns a new user, verify the new user is a project member
    if (updateData.assignee) {
        const isAssigneeOwner = project.owner.toString() === updateData.assignee;
        const isAssigneeMember = project.members.some(
            (m) => m.user.toString() === updateData.assignee
        );
        if (!isAssigneeOwner && !isAssigneeMember) {
            throw createBadRequestError("Assignee must be a member of the project");
        }
    }

    // Update the task and return the newly updated version ({ new: true })
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
        new: true,
    })
        .populate("project", "title status")
        .populate("assignee", "name email avatar")
        .populate("createdBy", "name email avatar");

    return updatedTask;
};

// Service to delete a task
export const deleteTaskService = async (userId, taskId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw createNotFoundError("Task not found");
    }

    // Fetch project to check permissions
    const project = await checkProjectAccess(userId, task.project);

    // Role-based permission checks to determine who can delete it
    const isOwner = project.owner.toString() === userId;
    const isManager = project.members.some(
        (m) => m.user.toString() === userId && m.role === "manager"
    );
    const isCreator = task.createdBy.toString() === userId;

    // Assignees generally shouldn't delete tasks unless they are also the creator or a manager
    if (!isOwner && !isManager && !isCreator) {
        throw createForbiddenError("You are not authorized to delete this task");
    }

    // Execute deletion in the database
    await Task.findByIdAndDelete(taskId);

    return { id: taskId };
};
