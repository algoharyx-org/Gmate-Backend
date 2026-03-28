import Notification from "../DB/models/notification.model.js";
import User from "../DB/models/user.model.js";
import sendMail from "./sendEmail.js";
import { getIO } from "../socket/socket.js";
import { config } from "../config/env.js";

function refId(val) {
  if (val == null) return undefined;
  if (typeof val === "object" && val._id != null) return val._id;
  return val;
}

function toPayload(doc) {
  return {
    id: String(doc._id),
    type: doc.type,
    title: doc.title,
    body: doc.body,
    read: doc.read,
    task: doc.task ? String(doc.task) : undefined,
    project: doc.project ? String(doc.project) : undefined,
    createdAt: doc.createdAt,
  };
}

export async function dispatchNotification({
  recipientId,
  type,
  title,
  body,
  taskId,
  projectId,
}) {
  const recipient = recipientId?.toString?.() ?? String(recipientId);

  const taskRef = refId(taskId);
  const projectRef = refId(projectId);

  const doc = await Notification.create({
    recipient,
    type,
    title,
    body,
    ...(taskRef && { task: taskRef }),
    ...(projectRef && { project: projectRef }),
  });

  const payload = toPayload(doc);
  const socketIO = getIO();
  if (socketIO) {
    socketIO.to(`user:${recipient}`).emit("notification", payload);
  }

  try {
    const user = await User.findById(recipient).select("email name");
    if (user?.email) {
      const appLabel = config.appName || "GMATE";
      const subject = `${appLabel}: ${title}`;
      const message = `${body}\n\n— ${appLabel}`;
      await sendMail({
        email: user.email,
        subject,
        message,
      });
    }
  } catch (err) {
    console.error("[dispatchNotification] email failed", err?.message || err);
  }

  return doc;
}
