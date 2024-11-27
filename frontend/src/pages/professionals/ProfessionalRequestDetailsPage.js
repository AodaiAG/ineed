import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate,useParams  } from "react-router-dom";
import { Button, Box, CircularProgress, Typography } from "@mui/material";
import StreamChatComponent from "../../components/client/StreamChatComponent"; // Import the Chat Component for professionals
import api from "../../utils/api"; // Axios instance for API calls
import useAuthCheck from "../../hooks/useAuthCheck"; // Hook to get authenticated professional details
import styles from "../../styles/RequestDetailsPage.module.css"; // Import the CSS styles

const ProfessionalRequestDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id: requestId } = useParams(); // Extract the ID from the URL path
  const [requestDetails, setRequestDetails] = useState(null); // State to hold request details
  const [userToken, setUserToken] = useState(null); // State to hold the professional's chat token
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Get the authenticated professional's data
  const { user, isAuthenticated, loading: authLoading } = useAuthCheck();

  useEffect(() => {
    if (authLoading) return; // Wait until authentication is complete

    if (!isAuthenticated) {
      console.error("User is not authenticated. Redirecting...");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchRequestDetails = async () => {
      try {
        const response = await api.get(`/api/professionals/request/${requestId}`);
        if (response.data.success) {
          setRequestDetails(response.data.data); // Set request details
        } else {
          setError(response.data.message || "Failed to fetch request details");
        }
      } catch (error) {
        console.error("Error fetching request details:", error);
        setError("An error occurred while fetching the request details");
      }
    };

    const joinChatChannel = async () => {
      try {
        console.log(user.profId)
        const response = await api.post(`/api/professionals/join-chat`, {
          userId: String(user.profId),
          requestId,
        });
        const responseToken = await api.post(`/api/generate-user-token`, {
          id: String(user.profId),
        });
        setUserToken(response.data.token);
        if (response.data.success) {
          setUserToken(responseToken.data.token); // Set the token for the chat
        } else {
          console.error("Failed to join the chat:", response.data.message);
          setError("Failed to join the chat");
        }
      } catch (error) {
        console.error("Error joining the chat:", error);
        setError("An error occurred while joining the chat");
      }
    };

    // Fetch both request details and join the chat channel
    Promise.all([fetchRequestDetails(), joinChatChannel()]).finally(() => {
      setLoading(false);
    });
  }, [authLoading, isAuthenticated, navigate, requestId, user]);

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.errorContainer}>
        <h1>{error}</h1>
        <Button
          variant="contained"
          onClick={() => navigate("/pro/expert-interface")}
          className={styles.backButton}
        >
          חזור
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.pageContainer}>
      {/* Header */}
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          פרטי הקריאה
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => console.log("Cancel or close logic")}
          className={styles.cancelButton}
        >
          סגור
        </Button>
      </Box>

      {/* Request Details */}
      <Box className={styles.details}>
        <Typography>
          <strong>בתחום:</strong> {requestDetails.jobRequiredId || "לא ידוע"}
        </Typography>
        <Typography>
          <strong>מיקום:</strong> {requestDetails.city || "לא ידוע"}
        </Typography>
        <Typography>
          <strong>מועד העבודה:</strong>{" "}
          {new Date(requestDetails.date).toLocaleString() || "לא ידוע"}
        </Typography>
        <Typography>
          <strong>הערות:</strong> {requestDetails.comment || "אין הערות"}
        </Typography>
      </Box>

      {/* Chat Section */}
      <Box className={styles.chatSection}>
        <Typography variant="h6" className={styles.chatTitle}>
          התכתבויות
        </Typography>
        <div className={styles.chatContainer}>
          {userToken ? (
            <StreamChatComponent
              apiKey="v5t2erh2ur73" // Replace with your Stream API key
              userToken={userToken} // Use the fetched chat token
              channelId={`request_${requestId}`} // Use the channel ID
              userID={String(user.profId)}
            />
          ) : (
            <Typography>Loading chat...</Typography>
          )}
        </div>
      </Box>

      {/* Footer */}
      <Box className={styles.footer}>
        <Button
          variant="contained"
          className={styles.backButton}
          onClick={() => navigate("/pro/expert-interface")}
        >
          חזור
        </Button>
      </Box>
    </Box>
  );
};

export default ProfessionalRequestDetailsPage;
