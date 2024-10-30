// src/scheduler.js
import cron from "node-cron";
import { Meeting } from "./models/meeting.model.js";

cron.schedule("* * * * *", async () => {
  // Runs every minute
  const now = new Date();
  const meetingsToStart = await Meeting.find({
    date: { $lte: now },
    isScheduled: true,
    isStarted: false,
  });

  meetingsToStart.forEach(async (meeting) => {
    meeting.isStarted = true;
    await meeting.save();
    // Optional: add code to notify users or emit a socket event
  });
});

console.log("Meeting scheduler started");
