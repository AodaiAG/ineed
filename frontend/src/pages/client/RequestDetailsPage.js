import { API_URL } from '../../utils/constans';
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Box, CircularProgress } from "@mui/material";
import StreamChatComponent from "../../components/client/StreamChatComponent"; // Import the StreamChatComponent
import styles from "../../styles/client/RequestDetailsPage.module.css"; // Import CSS styles
import axios from "axios";

const RequestDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id"); // Retrieve the requestId from the URL
  const [requestDetails, setRequestDetails] = useState(null); // State to hold request details
  const [userToken, setUserToken] = useState(null); // State to hold the user token
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        // Hardcoded data for testing
        const data = {
          id: requestId,
          field: "חשמלאי",
          subject: "התקנת שקע",
          location: "שלמה המלך 14, תל אביב",
          dateTime: "16/04/2024 21:30",
          clientNote: "אני צריך התקנה של שקע חשמל ליד המקור, יש לי קיר גבס.",
        };

        setRequestDetails(data); // Set the hardcoded data
      } catch (error) {
        console.error("Failed to fetch request details:", error);
      }
    };

    const fetchUserToken = async () => {
      try {
        const response = await axios.post(`${API_URL}/generate-user-token`, {
          id: "14", // Hardcoded user ID
        });
        console.log("User Token:", response.data.token); // Log the token
        setUserToken(response.data.token); // Set the token in state
      } catch (error) {
        console.error("Failed to fetch user token:", error);
      }
    };

    // Fetch both request details and user token
    Promise.all([fetchRequestDetails(), fetchUserToken()]).then(() => {
      setLoading(false); // Stop the loading spinner
    });
  }, [requestId]);

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={styles.pageContainer}>
      {/* Header */}
      <Box className={styles.header}>
        <h1 className={styles.title}>קריאה {requestId}</h1>
        <Button variant="contained" color="error" className={styles.cancelButton}>
          ביטול
        </Button>
      </Box>

      {/* Request Details */}
      <Box className={styles.details}>
        <p>
          <strong>בתחום:</strong> {requestDetails.field}
        </p>
        <p>
          <strong>בנושא:</strong> {requestDetails.subject}
        </p>
        <p>
          <strong>מיקום:</strong> {requestDetails.location}
        </p>
        <p>
          <strong>מועד העבודה:</strong> {requestDetails.dateTime}
        </p>
        <p>
          <strong>הערת לקוח:</strong> {requestDetails.clientNote}
        </p>
      </Box>

      {/* Chat Section */}
      <Box className={styles.chatSection}>
        <h2 className={styles.chatTitle}>התכתבויות</h2>
        <div className={styles.chatContainer}>
          {userToken ? (
            <StreamChatComponent
              apiKey="v5t2erh2ur73" // Replace with your Stream API key
              userToken={userToken} // Use the fetched user token
              channelId={requestId} // Unique channel for each request
            />
          ) : (
            <p>Loading chat...</p>
          )}
        </div>
      </Box>

      {/* Footer */}
      <Box className={styles.footer}>
        <Button variant="contained" className={styles.backButton}>
          חזור
        </Button>
      </Box>
    </Box>
  );
};

export default RequestDetailsPage;
