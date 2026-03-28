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
import { checkActive } from "../../middlewares/checkActive.js";

const projectRouter = Router();

projectRouter.use(authentication, checkActive)

projectRouter.post(
  "/",
  Validate(createProjectValidation),
  createProject,
);

projectRouter.get(
  "/me",
  Validate(getMyProjectsValidation),
  getMyProjects,
);
projectRouter.get("/", getAllProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.put(
  "/:id",
  Validate(updateProjectValidation),
  updateProject,
);
projectRouter.delete("/:id", deleteProject);

projectRouter.post(
  "/:id/members",
  Validate(addMemberValidation),
  addMember,
);
projectRouter.delete("/:id/members/:memberId", removeMember);
projectRouter.patch(
  "/:id/members/:memberId",
  Validate(updateMemberRoleValidation),
  updateMemberRole,
);

export default projectRouter;
