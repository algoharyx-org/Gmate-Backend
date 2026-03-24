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

// @desc     Add a new comment
// @route    POST /comments
// @access   Private
commentRouter.post(
  "/",
  authentication,
  Validate(addCommentValidation),
  addComment
);

// @desc     Get task comments
// @route    GET /comments/:taskId
// @access   Private
commentRouter.get(
  "/:taskId",
  authentication,
  Validate(getCommentsValidation),
  getComments
);

// @desc     Get one comment
// @route    GET /comments/one/:commentId
// @access   Private
commentRouter.get(
  "/one/:commentId",
  authentication,
  Validate(getOneCommentValidation),
  getCommentById
);

// @desc     Update comment
// @route    PUT /comments/:commentId
// @access   Private
commentRouter.put(
  "/:commentId",
  authentication,
  Validate(updateCommentValidation),
  updateComment
);

// @desc     Delete comment
// @route    DELETE /comments/:commentId
// @access   Private
commentRouter.delete(
  "/:commentId",
  authentication,
  Validate(deleteCommentValidation),
  deleteComment
);

export default commentRouter;