import { Router } from "express";
import {
  addComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
} from "./comment.controller.js";
import { authentication } from "../../middlewares/authentication.js";
import Validate from "../../middlewares/validate.js";
import {
  addCommentValidation,
  getCommentsValidation,
  getOneCommentValidation,
  updateCommentValidation,
  deleteCommentValidation,
} from "./comment.validator.js";

const commentRouter = Router();

commentRouter.post(
  "/",
  authentication,
  Validate(addCommentValidation),
  addComment,
);

commentRouter.get(
  "/:taskId",
  authentication,
  Validate(getCommentsValidation),
  getComments,
);

commentRouter.get(
  "/one/:commentId",
  authentication,
  Validate(getOneCommentValidation),
  getCommentById,
);

commentRouter.put(
  "/:commentId",
  authentication,
  Validate(updateCommentValidation),
  updateComment,
);

commentRouter.delete(
  "/:commentId",
  authentication,
  Validate(deleteCommentValidation),
  deleteComment,
);

export default commentRouter;
