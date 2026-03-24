import mongoose from "mongoose";
import dns from "node:dns/promises";
import { config } from "../config/env.js";
import { startOverdueTasksJob } from "../jobs/overdueTasks.job.js";
dns.setServers(["8.8.8.8"]);

function dbConnection() {
  mongoose
    .connect(config.dbUrl)
    .then(() => {
      console.log("DB connected successfully");
      startOverdueTasksJob(config.overdueCronSchedule);
    })
    .catch((err) => {
      console.log("DB connection failed", err);
    });
}

export default dbConnection;
