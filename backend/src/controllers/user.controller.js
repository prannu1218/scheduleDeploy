import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";

// Existing login function
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please Provide" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const token = crypto.randomBytes(20).toString("hex");
      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Username or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

// Existing register function
const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

// Existing getUserHistory function
const getUserHistory = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

// Existing addToHistory function
const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token });

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();
    res.status(httpStatus.CREATED).json({ message: "Added code to history" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

// New scheduleMeeting function
const scheduleMeeting = async (req, res) => {
  const { token, meetingCode, startTime } = req.body; // startTime is a required field for scheduling

  if (!startTime) {
    return res.status(400).json({ message: "Please provide a start time" });
  }

  try {
    // Find the user by token
    const user = await User.findOne({ token });
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid token" });
    }

    // Create a new meeting with the scheduled start time
    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode,
      date: new Date(startTime), // Set the start time here
      isScheduled: true,
      isStarted: false,
    });

    await newMeeting.save();
    res
      .status(httpStatus.CREATED)
      .json({ message: "Meeting scheduled successfully", meeting: newMeeting });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong ${e}` });
  }
};

// New getScheduledMeetings function to retrieve upcoming meetings
const getScheduledMeetings = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid token" });
    }

    const now = new Date();
    const upcomingMeetings = await Meeting.find({
      user_id: user.username,
      isScheduled: true,
      isStarted: false,
      date: { $gte: now }, // Only future meetings
    });

    res.status(httpStatus.OK).json({ meetings: upcomingMeetings });
  } catch (e) {
    res.status(500).json({ message: `Something went wrong ${e.message}` });
  }
};

export {
  login,
  register,
  getUserHistory,
  addToHistory,
  scheduleMeeting,
  getScheduledMeetings,
};
