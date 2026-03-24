import { Router } from "express";
import {
  addUser,
  Getallusers,
  Getuser,
  Updateuser,
  deleteuser,
} from "./user.controller.js";
import Validate from "../../middlewares/validate.js";
import {authentication} from "../../middlewares/authentication.js";
import {authorization} from "../../middlewares/authorization.js";
import { createUserValidator } from "./user.validator.js";
import { updateUserValidator } from "./user.validator.js";

const router = Router();

router.use(authentication,authorization('admin'))

router.post("/", Validate(createUserValidator), addUser); 
router.get("/allusers", Getallusers); 
router.get("/:id", Getuser); 
router.put("/:id", Validate(updateUserValidator), Updateuser); 
router.delete("/:id", deleteuser); 

export default router;
