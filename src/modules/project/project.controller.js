import expressAsyncHandler from "express-async-handler";
import {
  addMemberService,
  createProjectService,
  deleteProjectService,
  getAllProjectsService,
  getMyProjectsService,
  getProjectByIdService,
  removeMemberService,
  updateMemberRoleService,
  updateProjectService,
} from "./project.service.js";
import { createResponse, successResponse } from "../../utils/APIResponse.js";

// @desc     Create project
// @route    POST /projects
// @access   Private
export const createProject = expressAsyncHandler(async (req, res) => {
  const project = await createProjectService(req.userId, req.body);
  res.status(201).json(createResponse(project, "Project created successfully"));
});

// @desc     Get my projects (with progress and pagination)
// @route    GET /projects/me
// @access   Private
export const getMyProjects = expressAsyncHandler(async (req, res) => {
  const result = await getMyProjectsService(req.userId, req.query);
  res
    .status(200)
    .json(successResponse(result, "Projects retrieved successfully"));
});

// @desc     Get all projects
// @route    GET /projects
// @access   Private
export const getAllProjects = expressAsyncHandler(async (req, res) => {
  const projects = await getAllProjectsService(req.userId);
  res
    .status(200)
    .json(successResponse(projects, "Projects retrieved successfully"));
});

// @desc     Get project by id
// @route    GET /projects/:id
// @access   Private
export const getProjectById = expressAsyncHandler(async (req, res) => {
  const project = await getProjectByIdService(req.userId, req.params.id);
  res
    .status(200)
    .json(successResponse(project, "Project retrieved successfully"));
});

// @desc     Update project
// @route    PUT /projects/:id
// @access   Private
export const updateProject = expressAsyncHandler(async (req, res) => {
  const project = await updateProjectService(
    req.userId,
    req.params.id,
    req.body,
  );
  res
    .status(200)
    .json(successResponse(project, "Project updated successfully"));
});

// @desc     Delete project
// @route    DELETE /projects/:id
// @access   Private
export const deleteProject = expressAsyncHandler(async (req, res) => {
  await deleteProjectService(req.userId, req.params.id);
  res.status(200).json(successResponse({}, "Project deleted successfully"));
});

// @desc     Add project member
// @route    POST /projects/:id/members
// @access   Private
export const addMember = expressAsyncHandler(async (req, res) => {
  const project = await addMemberService(req.userId, req.params.id, req.body);
  res.status(200).json(successResponse(project, "Member added successfully"));
});

// @desc     Remove project member
// @route    DELETE /projects/:id/members/:memberId
// @access   Private
export const removeMember = expressAsyncHandler(async (req, res) => {
  const project = await removeMemberService(
    req.userId,
    req.params.id,
    req.params.memberId,
  );
  res.status(200).json(successResponse(project, "Member removed successfully"));
});

// @desc     Update project member role
// @route    PATCH /projects/:id/members/:memberId
// @access   Private
export const updateMemberRole = expressAsyncHandler(async (req, res) => {
  const project = await updateMemberRoleService(
    req.userId,
    req.params.id,
    req.params.memberId,
    req.body,
  );
  res
    .status(200)
    .json(successResponse(project, "Member role updated successfully"));
});
