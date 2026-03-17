import { Router } from "express";
import {
  addMember,
  createProject,
  deleteProject,
  getAllProjects,
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
  updateMemberRoleValidation,
  updateProjectValidation,
} from "./project.validator.js";
import { uploadFile, fileValidation } from "../../middlewares/multer.js";

const projectRouter = Router();

projectRouter.post(
  "/",
  authentication,
  uploadFile([...fileValidation.image, ...fileValidation.file]).array("files", 5),
  Validate(createProjectValidation),
  createProject,
);

projectRouter.get("/", authentication, getAllProjects);
projectRouter.get("/:id", authentication, getProjectById);
projectRouter.put(
  "/:id",
  authentication,
  uploadFile([...fileValidation.image, ...fileValidation.file]).array("files", 5),
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
