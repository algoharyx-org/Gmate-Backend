import Task from "../../DB/models/task.model.js";
import Project from "../../DB/models/project.model.js";
import User from "../../DB/models/user.model.js";
import {
    createBadRequestError,
    createForbiddenError,
    createNotFoundError,
} from "../../utils/APIErrors.js";

const checkProjectAccess = async (userId, projectId) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw createNotFoundError("Project not found");
    }

    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some((m) => m.user.toString() === userId);

    if (!isOwner && !isMember) {
        throw createForbiddenError(
            "You are not authorized to access tasks for this project"
        );
    }

    return project;
};

export const createTaskService = async (userId, taskData) => {
    const { project: projectId, assignee } = taskData;

    await checkProjectAccess(userId, projectId);

    if (assignee) {
        const assigneeUser = await User.findById(assignee);
        if (!assigneeUser) {
            throw createNotFoundError("Assignee not found");
        }
        const project = await Project.findById(projectId);
        const isAssigneeOwner = project.owner.toString() === assignee;
        const isAssigneeMember = project.members.some(
            (m) => m.user.toString() === assignee
        );

        if (!isAssigneeOwner && !isAssigneeMember) {
            throw createBadRequestError("Assignee must be a member of the project");
        }
    }
    const task = await Task.create({
        ...taskData,
        createdBy: userId,
    });

    return task;
};

export const getAllTasksService = async (userId, queryOptions = {}) => {
    const { projectId } = queryOptions;
    let filter = {};

    if (projectId) {
        await checkProjectAccess(userId, projectId);
        filter.project = projectId;
    } else {
        const projects = await Project.find({
            $or: [{ owner: userId }, { "members.user": userId }],
        }).select("_id");

        const projectIds = projects.map((p) => p._id);
        filter = {
            $or: [
                { project: { $in: projectIds } },
                { createdBy: userId },
                { assignee: userId },
            ],
        };
    }

    const tasks = await Task.find(filter)
        .populate("project", "title status")
        .populate("assignee", "name email avatar")
        .populate("createdBy", "name email avatar");

    return tasks;
};

export const getTaskByIdService = async (userId, taskId) => {
    const task = await Task.findById(taskId)
        .populate("project", "title status owner members")
        .populate("assignee", "name email avatar")
        .populate("createdBy", "name email avatar");

    if (!task) {
        throw createNotFoundError("Task not found");
    }

    await checkProjectAccess(userId, task.project._id);

    return task;
};

export const updateTaskService = async (userId, taskId, updateData) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw createNotFoundError("Task not found");
    }

    const project = await checkProjectAccess(userId, task.project);
    const isOwner = project.owner.toString() === userId;
    const isManager = project.members.some(
        (m) => m.user.toString() === userId && m.role === "manager"
    );
    const isCreator = task.createdBy.toString() === userId;
    const isAssignee = task.assignee?.toString() === userId;

    if (!isOwner && !isManager && !isCreator && !isAssignee) {
        throw createForbiddenError("You are not authorized to update this task");
    }

    if (updateData.assignee) {
        const isAssigneeOwner = project.owner.toString() === updateData.assignee;
        const isAssigneeMember = project.members.some(
            (m) => m.user.toString() === updateData.assignee
        );
        if (!isAssigneeOwner && !isAssigneeMember) {
            throw createBadRequestError("Assignee must be a member of the project");
        }
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
        new: true,
    })
        .populate("project", "title status")
        .populate("assignee", "name email avatar")
        .populate("createdBy", "name email avatar");

    return updatedTask;
};

export const deleteTaskService = async (userId, taskId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw createNotFoundError("Task not found");
    }

    const project = await checkProjectAccess(userId, task.project);

    const isOwner = project.owner.toString() === userId;
    const isManager = project.members.some(
        (m) => m.user.toString() === userId && m.role === "manager"
    );
    const isCreator = task.createdBy.toString() === userId;

    if (!isOwner && !isManager && !isCreator) {
        throw createForbiddenError("You are not authorized to delete this task");
    }

    await Task.findByIdAndDelete(taskId);

    return { id: taskId };
};
