import Project from "../../DB/models/project.model.js";
import User from "../../DB/models/user.model.js";
import {
  createForbiddenError,
  createNotFoundError,
} from "../../utils/APIErrors.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

export const createProjectService = async (ownerId, projectData, files) => {
  const attachments = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, "Gmate/Projects");
      attachments.push({
        url: result.secure_url,
        public_id: result.public_id,
        name: file.originalname,
        resource_type: result.resource_type,
        format: result.format,
      });
    }
  }

  const project = await Project.create({
    ...projectData,
    owner: ownerId,
    members: [{ user: ownerId, role: "manager" }],
    attachments,
  });

  return project;
};

export const getAllProjectsService = async (userId) => {
  const projects = await Project.find({
    $or: [{ owner: userId }, { "members.user": userId }],
  })
    .populate("owner members.user", "name email avatar");

  return projects;
};

export const getProjectByIdService = async (userId, projectId) => {
  const project = await Project.findById(projectId)
    .populate("owner members.user", "name email avatar");

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

export const updateProjectService = async (
  userId,
  projectId,
  updateData,
  files,
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
      "Only owners or managers can update project details",
    );
  }

  if (files && files.length > 0) {
    const attachments = [];
    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, "Gmate/Projects");
      attachments.push({
        url: result.secure_url,
        public_id: result.public_id,
        name: file.originalname,
        resource_type: result.resource_type,
        format: result.format,
      });
    }
    updateData.attachments = [...(project.attachments || []), ...attachments];
  }

  const updatedProject = await Project.findByIdAndUpdate(projectId, updateData, {
    new: true,
  })
    .populate("owner members.user", "name email avatar");

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
    .populate("owner members.user", "name email avatar");

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
    .populate("owner members.user", "name email avatar");

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
    .populate("owner members.user", "name email avatar");

  return updatedProject;
};
