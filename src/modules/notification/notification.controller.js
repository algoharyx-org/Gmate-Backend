import expressAsyncHandler from "express-async-handler";
import * as notificationService from "./notification.service.js";
import { successResponse } from "../../utils/APIResponse.js";

export const getMyNotifications = expressAsyncHandler(async (req, res) => {
  const data = await notificationService.getMyNotificationsService(
    req.userId,
    req.query,
  );
  res.status(200).json(successResponse(data, "Notifications retrieved"));
});

export const markNotificationRead = expressAsyncHandler(async (req, res) => {
  const doc = await notificationService.markNotificationReadService(
    req.userId,
    req.params.id,
  );
  res.status(200).json(successResponse(doc, "Notification marked read"));
});

export const markAllNotificationsRead = expressAsyncHandler(async (req, res) => {
  const result = await notificationService.markAllNotificationsReadService(
    req.userId,
  );
  res.status(200).json(successResponse(result, "All notifications marked read"));
});
