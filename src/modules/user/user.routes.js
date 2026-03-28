import { Router } from "express";
import Validate from "../../middlewares/validate.js";
import {authentication} from "../../middlewares/authentication.js";
import {authorization} from "../../middlewares/authorization.js";
import { createUserValidator } from "./user.validator.js";
import { updateUserValidator } from "./user.validator.js";
import { addUser, deleteUser, getAllUsers, getUser, updateUser } from './user.controller.js';
import { checkActive } from "../../middlewares/checkActive.js";

const router = Router();

router.use(authentication, checkActive, authorization('admin'))

router.post("/", Validate(createUserValidator), addUser); 
router.get("/", getAllUsers); 
router.get("/:id", getUser); 
router.put("/:id", Validate(updateUserValidator), updateUser); 
router.delete("/:id", deleteUser); 

export default router;
