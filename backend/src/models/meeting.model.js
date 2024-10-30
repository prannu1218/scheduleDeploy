import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    user_id: { type: String, required: true },
    meetingCode: { type: String, required: true, unique: true },
    date: { type: Date, required: true }, // Scheduled start date and time
    endTime: { type: Date }, // Optional end time if needed
    isScheduled: { type: Boolean, default: true }, // Indicates if it's a scheduled meeting
    isStarted: { type: Boolean, default: false }, // Indicates if the meeting has started
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };
