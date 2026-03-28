import { Router } from "express";
import Validate from "../../middlewares/validate.js";
import { authentication } from "../../middlewares/authentication.js";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./notification.controller.js";
import {
  listNotificationsValidator,
  markReadValidator,
} from "./notification.validator.js";
import { checkActive } from "../../middlewares/checkActive.js";

const router = Router();

router.use(authentication, checkActive);

router.get("/", Validate(listNotificationsValidator), getMyNotifications);
router.patch("/read-all", markAllNotificationsRead);
router.patch("/:id/read", Validate(markReadValidator), markNotificationRead);

export default router;
