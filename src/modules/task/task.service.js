import Task from "../../DB/models/task.model.js";
import Project from "../../DB/models/project.model.js";
import User from "../../DB/models/user.model.js";
import { NOTIFICATION_TYPE, TASK_STATUS } from "../../config/constants.js";
import { dispatchNotification } from "../../utils/dispatchNotification.js";
import {
  createBadRequestError,
  createForbiddenError,
  createNotFoundError,
} from "../../utils/APIErrors.js";
import Features from "../../utils/features.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/uploadFiles.js";

const checkProjectAccess = async (userId, projectId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw createNotFoundError("Project not found");
  }

  const isOwner = project.owner.toString() === userId;
  const isMember = project.members.some((m) => m.user.toString() === userId);

  if (!isOwner && !isMember) {
    throw createForbiddenError(
      "You are not authorized to access tasks for this project",
    );
  }

  return project;
};

export const createTaskService = async (userId, taskData) => {
  const { project: projectId, assignee } = taskData;

  if (projectId) {
    await checkProjectAccess(userId, projectId);
  }

  if (assignee) {
    const assigneeUser = await User.findById(assignee);
    if (!assigneeUser) {
      throw createNotFoundError("Assignee not found");
    }
    if (projectId) {
      const project = await Project.findById(projectId);
      const isAssigneeOwner = project.owner.toString() === assignee;
      const isAssigneeMember = project.members.some(
        (m) => m.user.toString() === assignee,
      );

      if (!isAssigneeOwner && !isAssigneeMember) {
        throw createBadRequestError("Assignee must be a member of the project");
      }
    }
  }
  const task = await Task.create({
    ...taskData,
    createdBy: userId,
  });

  if (assignee && String(assignee) !== String(userId)) {
    await dispatchNotification({
      recipientId: assignee,
      type: NOTIFICATION_TYPE.TASK_ASSIGNED,
      title: "Task assigned to you",
      body: `You were assigned: "${task.title}".`,
      taskId: task._id,
      projectId: task.project,
    });
  }

  return task;
};

export const getAllTasksService = async (userId, query = {}) => {
  const { projectId, ...queryForFeatures } = query;
  let accessFilter;

  if (projectId) {
    await checkProjectAccess(userId, projectId);
    accessFilter = { project: projectId };
  } else {
    const projects = await Project.find({
      $or: [{ owner: userId }, { "members.user": userId }],
    }).select("_id");

    const projectIds = projects.map((p) => p._id);
    accessFilter = {
      $or: [
        { project: { $in: projectIds } },
        { createdBy: userId },
        { assignee: userId },
      ],
    };
  }

  const feature = new Features(Task.find(accessFilter), queryForFeatures)
    .filter()
    .sort()
    .limitFields()
    .search("task");

  const documentsCount = await Task.countDocuments(
    feature.mongooseQuery.getFilter(),
  );
  feature.pagination(documentsCount);

  const tasks = await feature.mongooseQuery
    .populate("project", "title status")
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar");

  return {
    tasks,
    length: documentsCount,
    metadata: feature.paginationResult,
  };
};

export const getMyTasksService = async (userId, query = {}) => {
  const { projectId, ...queryForFeatures } = query;

  let accessFilter;
  if (projectId) {
    accessFilter = {
      $and: [
        {
          $or: [{ createdBy: userId }, { assignee: userId }],
        },
        { project: projectId },
      ],
    };
  } else {
    accessFilter = {
      $or: [{ createdBy: userId }, { assignee: userId }],
    };
  }

  const feature = new Features(
    Task.find(accessFilter).select(
      "title description status priority project assignee createdBy createdAt",
    ),
    queryForFeatures,
  )
    .filter()
    .sort()
    .limitFields()
    .search("task");

  const documentsCount = await Task.countDocuments(
    feature.mongooseQuery.getFilter(),
  );
  feature.pagination(documentsCount);

  const tasks = await feature.mongooseQuery
    .populate("project", "title status")
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar");

  return {
    tasks,
    length: documentsCount,
    metadata: feature.paginationResult,
  };
};

export const getTaskByIdService = async (userId, taskId) => {
  const task = await Task.findById(taskId)
    .populate("comments")
    .populate("project", "title status owner members")
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar");

  if (!task) {
    throw createNotFoundError("Task not found");
  }

  if (task.project) {
    await checkProjectAccess(userId, task.project._id);
  } else {
    const isCreator =
      task.createdBy?._id?.toString() === userId ||
      task.createdBy?.toString() === userId;
    const isAssignee =
      task.assignee?._id?.toString() === userId ||
      task.assignee?.toString() === userId;

    if (!isCreator && !isAssignee) {
      throw createForbiddenError("You are not authorized to access this task");
    }
  }

  return task;
};

export const updateTaskService = async (userId, taskId, updateData) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw createNotFoundError("Task not found");
  }

  let isOwner = false;
  let isManager = false;

  if (task.project) {
    const project = await checkProjectAccess(userId, task.project);
    isOwner = project.owner.toString() === userId;
    isManager = project.members.some(
      (m) => m.user.toString() === userId && m.role === "manager",
    );
  }

  const isCreator = task.createdBy.toString() === userId;
  const isAssignee = task.assignee?.toString() === userId;

  if (!isOwner && !isManager && !isCreator && !isAssignee) {
    throw createForbiddenError("You are not authorized to update this task");
  }

  if (updateData.assignee && task.project) {
    const project = await Project.findById(task.project);
    const isAssigneeOwner = project.owner.toString() === updateData.assignee;
    const isAssigneeMember = project.members.some(
      (m) => m.user.toString() === updateData.assignee,
    );
    if (!isAssigneeOwner && !isAssigneeMember) {
      throw createBadRequestError("Assignee must be a member of the project");
    }
  }

  const prevAssigneeId = task.assignee?.toString() ?? null;

  let payload = updateData;
  if (task.status === TASK_STATUS.OVERDUE && updateData.dueDate !== undefined) {
    const newDue = new Date(updateData.dueDate);
    if (
      !Number.isNaN(newDue.getTime()) &&
      newDue > new Date() &&
      updateData.status === undefined
    ) {
      payload = { ...updateData, status: TASK_STATUS.TODO };
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, payload, {
    new: true,
  })
    .populate("project", "title status")
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar");

  if (updateData.assignee !== undefined && updatedTask) {
    const nextId = updatedTask.assignee?.toString() ?? null;
    if (nextId && nextId !== prevAssigneeId && nextId !== String(userId)) {
      await dispatchNotification({
        recipientId: nextId,
        type: NOTIFICATION_TYPE.TASK_ASSIGNED,
        title: "Task assigned to you",
        body: `You were assigned: "${updatedTask.title}".`,
        taskId: updatedTask._id,
        projectId: updatedTask.project,
      });
    }
  }

  return updatedTask;
};

export const deleteTaskService = async (userId, taskId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw createNotFoundError("Task not found");
  }

  let isOwner = false;
  let isManager = false;

  if (task.project) {
    const project = await checkProjectAccess(userId, task.project);
    isOwner = project.owner.toString() === userId;
    isManager = project.members.some(
      (m) => m.user.toString() === userId && m.role === "manager",
    );
  }

  const isCreator = task.createdBy.toString() === userId;

  if (!isOwner && !isManager && !isCreator) {
    throw createForbiddenError("You are not authorized to delete this task");
  }

  await Task.findByIdAndDelete(taskId);

  return { id: taskId };
};

export const assignTaskService = async (userId, taskId, assignee) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw createNotFoundError("Task not found");
  }

  let isOwner = false;
  let isManager = false;

  if (task.project) {
    const project = await checkProjectAccess(userId, task.project);
    isOwner = project.owner.toString() === userId;
    isManager = project.members.some(
      (m) => m.user.toString() === userId && m.role === "manager",
    );
  }

  const isCreator = task.createdBy.toString() === userId;

  if (!isOwner && !isManager && !isCreator) {
    throw createForbiddenError("You are not authorized to assign this task");
  }

  const assigneeId = await User.findOne({ email: assignee.email });

  if (!assigneeId) {
    throw createNotFoundError("Assignee not found");
  }

  if (task.project) {
    const project = await Project.findById(task.project);
    const isAssigneeOwner =
      project.owner.toString() === assigneeId._id.toString();
    const isAssigneeMember = project.members.some(
      (m) => m.user.toString() === assigneeId._id.toString(),
    );

    if (!isAssigneeOwner && !isAssigneeMember) {
      throw createBadRequestError("Assignee must be a member of the project");
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { assignee: assigneeId._id },
    { new: true },
  )
    .populate("project", "title status")
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar");

  if (
    String(assigneeId._id) !== String(userId) &&
    String(task.assignee ?? "") !== String(assigneeId._id)
  ) {
    await dispatchNotification({
      recipientId: assigneeId._id,
      type: NOTIFICATION_TYPE.TASK_ASSIGNED,
      title: "Task assigned to you",
      body: `You were assigned: "${task.title}".`,
      taskId: updatedTask._id,
      projectId: updatedTask.project,
    });
  }

  return updatedTask;
};

export const uploadTaskAttachmentsService = async (userId, taskId, files) => {
  if (!files || files.length === 0) {
    throw createBadRequestError("At least one file is required");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw createNotFoundError("Task not found");
  }

  if (task.project) {
    await checkProjectAccess(userId, task.project);
  } else {
    const isCreator = task.createdBy.toString() === userId;
    const isAssignee = task.assignee?.toString() === userId;

    if (!isCreator && !isAssignee) {
      throw createForbiddenError("You are not authorized to modify this task");
    }
  }

  // Upload all files to Cloudinary in parallel
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file, "GMATE/tasks"),
  );
  const uploadResults = await Promise.all(uploadPromises);

  // Map Cloudinary results to attachment objects
  const attachments = uploadResults.map((result, index) => ({
    url: result.url,
    publicId: result.publicId,
  }));

  // Push all new attachments into the task
  task.attachments.push(...attachments);
  task.status = "in-progress";
  await task.save();

  const updatedTask = await Task.findById(taskId)
    .populate("project", "title status")
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar");

  return updatedTask;
};

export const deleteTaskAttachmentService = async (
  userId,
  taskId,
  attachmentId,
) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw createNotFoundError("Task not found");
  }

  if (task.project) {
    await checkProjectAccess(userId, task.project);
  } else {
    const isCreator = task.createdBy.toString() === userId;
    const isAssignee = task.assignee?.toString() === userId;

    if (!isCreator && !isAssignee) {
      throw createForbiddenError("You are not authorized to modify this task");
    }
  }

  const attachment = task.attachments.id(attachmentId);
  if (!attachment) {
    throw createNotFoundError("Attachment not found");
  }

  // Delete from Cloudinary
  await deleteFromCloudinary(attachment.publicId);

  // Remove from task
  task.attachments.pull(attachmentId);
  await task.save();

  const updatedTask = await Task.findById(taskId)
    .populate("project", "title status")
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar");

  return updatedTask;
};
