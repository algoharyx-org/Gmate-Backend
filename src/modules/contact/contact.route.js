import { Router } from "express";
import {
  contact,
  deleteContact,
  getContact,
  getContactById,
  getUnreadContact,
  markAllContactsRead,
  markContactRead,
} from "./contact.controller.js";
import { contactValidation } from "./contact.validator.js";
import Validate from "../../middlewares/validate.js";
import { authentication } from "../../middlewares/authentication.js";
import { authorization } from "../../middlewares/authorization.js";
import { checkActive } from "../../middlewares/checkActive.js";

const contactRouter = Router();

contactRouter.post("/", Validate(contactValidation), contact);
contactRouter.get(
  "/",
  authentication,
  checkActive,
  authorization("admin"),
  getContact,
);
contactRouter.get(
  "/unread",
  authentication,
  checkActive,
  authorization("admin"),
  getUnreadContact,
);
contactRouter.get(
  "/:id",
  authentication,
  checkActive,
  authorization("admin"),
  getContactById,
);
contactRouter.delete(
  "/:id",
  authentication,
  checkActive,
  authorization("admin"),
  deleteContact,
);
contactRouter.put(
  "/:id",
  authentication,
  checkActive,
  authorization("admin"),
  markContactRead,
);
contactRouter.put(
  "/",
  authentication,
  checkActive,
  authorization("admin"),
  markAllContactsRead,
);

export default contactRouter;
