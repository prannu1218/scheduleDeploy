import express from "express";
import { login, register, getUserHistory, addToHistory, scheduleMeeting, getScheduledMeetings } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.route("/add_to_activity").post(addToHistory)
router.route("/get_all_activity").get(getUserHistory)
router.post("/schedule", scheduleMeeting);
router.get("/scheduled-meetings", getScheduledMeetings);  // New route for fetching scheduled meetings

export default router;
