import cron from "node-cron";
import Task from "../DB/models/task.model.js";
import { TASK_STATUS } from "../config/constants.js";

export async function markOverdueTasks() {
  const now = new Date();
  const result = await Task.updateMany(
    {
      dueDate: { $lt: now },
      status: { $nin: [TASK_STATUS.COMPLETED, TASK_STATUS.OVERDUE] },
    },
    { $set: { status: TASK_STATUS.OVERDUE } },
  );
  return result.modifiedCount;
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
