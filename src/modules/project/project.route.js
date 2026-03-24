import { Router } from "express";
import {
  addMember,
  createProject,
  deleteProject,
  getAllProjects,
  getMyProjects,
  getProjectById,
  removeMember,
  updateMemberRole,
  updateProject,
} from "./project.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import Validate from "../../middlewares/validate.js";
import {
  addMemberValidation,
  createProjectValidation,
  getMyProjectsValidation,
  updateMemberRoleValidation,
  updateProjectValidation,
} from "./project.validator.js";

const projectRouter = Router();

projectRouter.post(
  "/",
  authentication,
  Validate(createProjectValidation),
  createProject,
);

projectRouter.get(
  "/me",
  authentication,
  Validate(getMyProjectsValidation),
  getMyProjects,
);
projectRouter.get("/", authentication, getAllProjects);
projectRouter.get("/:id", authentication, getProjectById);
projectRouter.put(
  "/:id",
  authentication,
  Validate(updateProjectValidation),
  updateProject,
);
projectRouter.delete("/:id", authentication, deleteProject);

projectRouter.post(
  "/:id/members",
  authentication,
  Validate(addMemberValidation),
  addMember,
);
projectRouter.delete("/:id/members/:memberId", authentication, removeMember);
projectRouter.patch(
  "/:id/members/:memberId",
  authentication,
  Validate(updateMemberRoleValidation),
  updateMemberRole,
);

export default projectRouter;
