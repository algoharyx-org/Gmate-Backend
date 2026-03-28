import Notification from "../../DB/models/notification.model.js";
import Features from "../../utils/features.js";
import { createNotFoundError } from "../../utils/APIErrors.js";

export const getMyNotificationsService = async (userId, query = {}) => {
  const { read, ...queryForFeatures } = query;

  const filter = { recipient: userId };
  if (read !== undefined && read !== null && read !== "") {
    if (read === true || read === "true") filter.read = true;
    else if (read === false || read === "false") filter.read = false;
  }

  const feature = new Features(Notification.find(filter), queryForFeatures)
    .sort()
    .limitFields();

  const documentsCount = await Notification.countDocuments(
    feature.mongooseQuery.getFilter(),
  );
  feature.pagination(documentsCount);

  const [notifications, unreadCount] = await Promise.all([
    feature.mongooseQuery.lean(),
    Notification.countDocuments({ recipient: userId, read: false }),
  ]);

  return {
    notifications,
    unreadCount,
    length: documentsCount,
    metadata: feature.paginationResult,
  };
};

export const markNotificationReadService = async (userId, notificationId) => {
  const doc = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true },
    { new: true },
  ).lean();

  if (!doc) {
    throw createNotFoundError("Notification not found");
  }

  return doc;
};

export const markAllNotificationsReadService = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, read: false },
    { read: true },
  );

  return { modifiedCount: result.modifiedCount };
};
