import mongoose from "mongoose";
import { NOTIFICATION_TYPE } from "../../config/constants.js";

const notificationTypes = Object.values(NOTIFICATION_TYPE);

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: notificationTypes,
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
