import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext"; // Adjust the import path as necessary

function ScheduleMeeting() {
  const { userData } = useContext(AuthContext); // Access userData from context
  const [startTime, setStartTime] = useState("");

  // Make sure to get the actual user ID
  const userID = userData.id; // Assuming userData has an 'id' property

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/schedule-meeting", { hostID: userID, startTime });
      alert("Meeting scheduled successfully");
    } catch (error) {
      console.error("Error scheduling meeting", error);
      alert("Failed to schedule meeting");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Start Time:</label>
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />
      <button type="submit">Schedule Meeting</button>
    </form>
  );
}

export default ScheduleMeeting;
