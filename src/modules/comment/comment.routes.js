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
import { checkActive } from "../../middlewares/checkActive.js";

const commentRouter = Router();

commentRouter.use(authentication, checkActive)

commentRouter.post(
  "/",
  Validate(addCommentValidation),
  addComment
);

commentRouter.get(
  "/task/:taskId",
  Validate(getCommentsValidation),
  getComments
);

commentRouter.get(
  "/:commentId",
  Validate(getOneCommentValidation),
  getCommentById
);

commentRouter.put(
  "/:commentId",
  Validate(updateCommentValidation),
  updateComment
);

commentRouter.delete(
  "/:commentId",
  Validate(deleteCommentValidation),
  deleteComment
);

export default commentRouter;