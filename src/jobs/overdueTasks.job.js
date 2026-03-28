import cron from "node-cron";
import Task from "../DB/models/task.model.js";
import { NOTIFICATION_TYPE, TASK_STATUS } from "../config/constants.js";
import { dispatchNotification } from "../utils/dispatchNotification.js";

export async function markOverdueTasks() {
  const now = new Date();
  const tasks = await Task.find({
    dueDate: { $lt: now },
    status: { $nin: [TASK_STATUS.COMPLETED, TASK_STATUS.OVERDUE] },
  }).select("_id title assignee createdBy project dueDate status");

  let transitioned = 0;
  for (const task of tasks) {
    const result = await Task.updateOne(
      {
        _id: task._id,
        dueDate: { $lt: now },
        status: { $nin: [TASK_STATUS.COMPLETED, TASK_STATUS.OVERDUE] },
      },
      { $set: { status: TASK_STATUS.OVERDUE } },
    );
    if (result.modifiedCount === 0) {
      continue;
    }
    transitioned += 1;
    const recipients = new Set();
    if (task.assignee) recipients.add(String(task.assignee));
    if (task.createdBy) recipients.add(String(task.createdBy));
    for (const rid of recipients) {
      await dispatchNotification({
        recipientId: rid,
        type: NOTIFICATION_TYPE.TASK_OVERDUE,
        title: "Task overdue",
        body: `The task "${task.title}" is now overdue.`,
        taskId: task._id,
        projectId: task.project,
      });
    }
  }
  return transitioned;
}

export function startOverdueTasksJob(schedule) {
  markOverdueTasks().catch((err) => {
    console.error("[overdueTasks] initial run failed", err);
  });

  cron.schedule(schedule, async () => {
    try {
      const n = await markOverdueTasks();
      if (n > 0) {
        console.log(`[overdueTasks] marked ${n} task(s) overdue`);
      }
    } catch (err) {
      console.error("[overdueTasks]", err);
    }
  });
}
