import mongoose from "mongoose";
import Project from "../../DB/models/project.model.js";
import User from "../../DB/models/user.model.js";
import {
  createBadRequestError,
  createForbiddenError,
  createNotFoundError,
} from "../../utils/APIErrors.js";
import { getPagination, getPaginationMetadata } from "../../utils/pagination.js";

export const createProjectService = async (ownerId, projectData) => {
  const project = await Project.create({
    ...projectData,
    owner: ownerId,
    members: [{ user: ownerId, role: "manager" }],
  });

  return project;
};

export const getAllProjectsService = async (userId) => {
  const projects = await Project.aggregate([

    {
      $match: {
        $or: [
          { owner: new mongoose.Types.ObjectId(userId) },
          { "members.user": new mongoose.Types.ObjectId(userId) }
        ]
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },

    {
      $unwind: "$owner"
    },

    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "project",
        as: "tasks"
      }
    },

    {
      $addFields: {
        totalTasks: { $size: "$tasks" },

        completedTasks: {
          $size: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: { $eq: ["$$task.status", "completed"] }
            }
          }
        }
      }
    },


    {
      $addFields: {
        progressPercentage: {
          $cond: [
            { $eq: ["$totalTasks", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$completedTasks", "$totalTasks"] },
                    100
                  ]
                },
                0   
              ]
            }
          ]
        }
      }
    },

    {
      $project: {
        _id: 1,
        title: 1,
        status: 1,

        owner: {
          name: "$owner.name",
          email: "$owner.email",
          avatar: "$owner.avatar"
        },

        totalTasks: 1,
        completedTasks: 1,
        progressPercentage: 1
      }
    }
  ]);
  return projects;
};

export const getMyProjectsService = async (userId, query = {}) => {
  const { page, limit } = query;
  const pagination = getPagination(page, limit);

  const matchStage = {
    $match: {
      $or: [
        { owner: new mongoose.Types.ObjectId(userId) },
        { "members.user": new mongoose.Types.ObjectId(userId) },
      ],
    },
  };

  const lookupTasksStage = {
    $lookup: {
      from: "tasks",
      localField: "_id",
      foreignField: "project",
      as: "tasks",
    },
  };

  const lookupOwnerStage = {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "owner",
    },
  };

  const unwindOwnerStage = {
    $unwind: "$owner",
  };

  const addFieldsStage = {
    $addFields: {
      totalTasks: { $size: "$tasks" },
      completedTasks: {
        $size: {
          $filter: {
            input: "$tasks",
            as: "task",
            cond: { $eq: ["$$task.status", "completed"] },
          },
        },
      },
    },
  };

  const progressStage = {
    $addFields: {
      progressPercentage: {
        $cond: {
          if: { $gt: ["$totalTasks", 0] },
          then: {
            $multiply: [{ $divide: ["$completedTasks", "$totalTasks"] }, 100],
          },
          else: 0,
        },
      },
    },
  };

  const projectStage = {
    $project: {
      title: 1,
      description: 1,
      status: 1,
      "owner.name": 1,
      "owner.email": 1,
      "owner.avatar": 1,
      totalTasks: 1,
      completedTasks: 1,
      progressPercentage: 1,
      createdAt: 1,
    },
  };

  const pipeline = [
    matchStage,
    lookupTasksStage,
    lookupOwnerStage,
    unwindOwnerStage,
    addFieldsStage,
    progressStage,
    projectStage,
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: pagination.skip }, { $limit: pagination.limit }],
      },
    },
  ];

  const result = await Project.aggregate(pipeline);

  const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
  const metadata = getPaginationMetadata(total, pagination.page, pagination.limit);

  return {
    projects: result[0].data,
    ...metadata,
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
