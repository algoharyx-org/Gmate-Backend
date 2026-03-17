import { Router } from "express";
import {
  addUser,
  Getallusers,
  Getuser,
  Updateuser,
  deleteuser,
} from "./user.controller.js";
import Validate from "../../middlewares/validate.js";
import { createUserValidator } from "./user.validator.js";
import { uploadFile, fileValidation } from "../../middlewares/multer.js";

const router = Router();

router.post("/", Validate(createUserValidator), addUser); // done
router.get("/allusers", Getallusers); // done
router.get("/:id", Getuser); //done
router.put(
  "/:id",
  uploadFile(fileValidation.image).single("avatar"),
  Validate(createUserValidator),
  Updateuser,
); // done
router.delete("/:id", deleteuser); // done

export default router;
