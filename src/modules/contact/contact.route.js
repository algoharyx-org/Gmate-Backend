import { Router } from "express";
import { contact } from "./contact.controller.js";
import { contactValidation } from "./contact.validator.js";
import Validate from "../../middlewares/validate.js";

const contactRouter = Router();

contactRouter.post("/", Validate(contactValidation), contact);

export default contactRouter;
