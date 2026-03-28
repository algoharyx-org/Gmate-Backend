import Project from "../../DB/models/project.model.js";
import Task from "../../DB/models/task.model.js";
import User from "../../DB/models/user.model.js";
import {
  createBadRequestError,
  createForbiddenError,
  createNotFoundError,
} from "../../utils/APIErrors.js";
import Features from "../../utils/features.js";
import { NOTIFICATION_TYPE } from "../../config/constants.js";
import { dispatchNotification } from "../../utils/dispatchNotification.js";

const taskStatsByProjectIds = async (ids) => {
  if (!ids.length) return new Map();
  const stats = await Task.aggregate([
    { $match: { project: { $in: ids } } },
    {
      $group: {
        _id: "$project",
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
      },
    },
  ]);
  return new Map(stats.map((s) => [String(s._id), s]));
};

const enrichProjectsWithTaskStats = async (projects, { includeDetails = false } = {}) => {
  if (!projects.length) return projects;

  const map = await taskStatsByProjectIds(projects.map((p) => p._id));

  return projects.map((p) => {
    const s = map.get(String(p._id)) || { totalTasks: 0, completedTasks: 0 };
    const total = s.totalTasks;
    const completed = s.completedTasks;
    const progressPercentage =
      total === 0 ? 0 : Math.round((completed / total) * 100);
    const owner = p.owner
      ? {
          name: p.owner.name,
          email: p.owner.email,
          avatar: p.owner.avatar,
        }
      : null;

    const row = {
      _id: p._id,
      title: p.title,
      status: p.status,
      owner,
      totalTasks: total,
      completedTasks: completed,
      progressPercentage,
    };

    if (includeDetails) {
      return {
        ...row,
        description: p.description,
        createdAt: p.createdAt,
      };
    }

    return row;
  });
};

const attachTaskProgress = (projects) =>
  enrichProjectsWithTaskStats(projects, { includeDetails: false });

export const createProjectService = async (ownerId, projectData) => {
  const project = await Project.create({
    ...projectData,
    owner: ownerId,
    members: [{ user: ownerId, role: "manager" }],
  });

  return project;
};

export const getAllProjectsService = async (userId, query = {}) => {
  const accessFilter = {
    $or: [
      { owner: userId },
      { "members.user": userId },
    ],
  };

  const feature = new Features(
    Project.find(accessFilter).select("title status owner"),
    query,
  )
    .filter()
    .sort()
    .limitFields()
    .search("project");

  const documentsCount = await Project.countDocuments(
    feature.mongooseQuery.getFilter(),
  );
  feature.pagination(documentsCount);

  const raw = await feature.mongooseQuery
    .populate("owner", "name email avatar")
    .lean();

  const projects = await attachTaskProgress(raw);

  return {
    projects,
    length: documentsCount,
    metadata: feature.paginationResult,
  };
};

export const getCompletedProjectService = async () => {
  const projects = await Project.find({ status: "completed" });
  return { length: projects.length };
}

export const getMyProjectsService = async (userId, query = {}) => {
  const accessFilter = {
    $or: [
      { owner: userId },
      { "members.user": userId },
    ],
  };

  const feature = new Features(
    Project.find(accessFilter).select(
      "title description status owner createdAt",
    ),
    query,
  )
    .filter()
    .sort()
    .limitFields()
    .search("project");

  const documentsCount = await Project.countDocuments(
    feature.mongooseQuery.getFilter(),
  );
  feature.pagination(documentsCount);

  const raw = await feature.mongooseQuery
    .populate("owner", "name email avatar")
    .lean();

  const projects = await enrichProjectsWithTaskStats(raw, {
    includeDetails: true,
  });

  return {
    projects,
    length: documentsCount,
    metadata: feature.paginationResult,
  };
};

export const getProjectByIdService = async (userId, projectId) => {
  const project = await Project.findById(projectId)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  if (!project) {
    throw createNotFoundError("Project not found");
  }

  const isOwner = project.owner._id.toString() === userId;
  const isMember = project.members.some(
    (m) => m.user._id.toString() === userId,
  );

  if (!isOwner && !isMember) {
    throw createForbiddenError("You are not authorized to view this project");
  }

  return project;
};

export const updateProjectService = async (userId, projectId, updateData) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw createNotFoundError("Project not found");
  }

  const isOwner = project.owner.toString() === userId;
  const isManager = project.members.some(
    (m) => m.user.toString() === userId && m.role === "manager",
  );

  if (!isOwner && !isManager) {
    throw createForbiddenError(
      "Only owners or managers can update project details",
    );
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    updateData,
    { new: true },
  )
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  return updatedProject;
};

export const deleteProjectService = async (userId, projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw createNotFoundError("Project not found");
  }

  if (project.owner.toString() !== userId) {
    throw createForbiddenError("Only the owner can delete the project");
  }

  await Project.findByIdAndDelete(projectId);

  return { id: projectId };
};

export const addMemberService = async (userId, projectId, memberData) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw createNotFoundError("Project not found");
  }

  const isOwner = project.owner.toString() === userId;
  const isManager = project.members.some(
    (m) => m.user.toString() === userId && m.role === "manager",
  );

  if (!isOwner && !isManager) {
    throw createForbiddenError("Only owners or managers can add members");
  }

  const userToAdd = await User.findOne({ email: memberData.email });
  if (!userToAdd) {
    throw createNotFoundError("User to add not found");
  }

  const isAlreadyMember = project.members.some(
    (m) => m.user.toString() === userToAdd._id.toString(),
  );

  if (
    isAlreadyMember ||
    project.owner.toString() === userToAdd._id.toString()
  ) {
    throw createBadRequestError("User is already a member of this project");
  }

  project.members.push({ user: userToAdd._id, role: memberData.role });
  await project.save();

  const updatedProject = await Project.findById(projectId)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  await dispatchNotification({
    recipientId: userToAdd._id,
    type: NOTIFICATION_TYPE.PROJECT_MEMBER_ADDED,
    title: "Added to project",
    body: `You were added to project "${updatedProject.title}".`,
    projectId: updatedProject._id,
  });

  return updatedProject;
};

export const removeMemberService = async (userId, projectId, memberId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw createNotFoundError("Project not found");
  }

  const isOwner = project.owner.toString() === userId;
  const isManager = project.members.some(
    (m) => m.user.toString() === userId && m.role === "manager",
  );

  if (!isOwner && !isManager) {
    throw createForbiddenError("Only owners or managers can remove members");
  }

  const memberIndex = project.members.findIndex(
    (m) => m.user.toString() === memberId,
  );

  if (memberIndex === -1) {
    throw createNotFoundError("Member not found in this project");
  }

  const memberToRemove = project.members[memberIndex];

  if (!isOwner && memberToRemove.role === "manager") {
    throw createForbiddenError("Managers cannot remove other managers");
  }

  project.members.splice(memberIndex, 1);
  await project.save();

  const updatedProject = await Project.findById(projectId)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  return updatedProject;
};

export const updateMemberRoleService = async (
  userId,
  projectId,
  memberId,
  roleData,
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw createNotFoundError("Project not found");
  }

  const isOwner = project.owner.toString() === userId;
  const isManager = project.members.some(
    (m) => m.user.toString() === userId && m.role === "manager",
  );

  if (!isOwner && !isManager) {
    throw createForbiddenError(
      "Only owners or managers can update member roles",
    );
  }

  const memberIndex = project.members.findIndex(
    (m) => m.user.toString() === memberId,
  );

  if (memberIndex === -1) {
    throw createNotFoundError("Member not found in this project");
  }

  const memberToUpdate = project.members[memberIndex];

  if (!isOwner && memberToUpdate.role === "manager") {
    throw createForbiddenError("Managers cannot update other managers roles");
  }

  project.members[memberIndex].role = roleData.role;
  await project.save();

  const updatedProject = await Project.findById(projectId)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  return updatedProject;
};
