// src/pages/UpcomingMeetings.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

function UpcomingMeetings() {
  const [meetings, setMeetings] = useState([]);
  const { userData } = useContext(AuthContext); // Get userData from context
  const userID = userData.id; // Use the actual user ID from userData

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`/api/upcoming-meetings/${userID}`);
        setMeetings(response.data.meetings);
      } catch (error) {
        console.error("Error fetching meetings", error);
      }
    };
    fetchMeetings();
  }, [userID]);

  return (
    <div>
      <h3>Upcoming Meetings</h3>
      <ul>
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <li key={meeting.meetingID}>
              Meeting ID: {meeting.meetingID}, Start Time:{" "}
              {new Date(meeting.startTime).toLocaleString()}
            </li>
          ))
        ) : (
          <li>No upcoming meetings scheduled.</li>
        )}
      </ul>
    </div>
  );
}

export default UpcomingMeetings;
