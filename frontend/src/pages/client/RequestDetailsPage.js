import { API_URL } from "../../utils/constans";
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Box, CircularProgress } from "@mui/material";
import StreamChatComponent from "../../components/client/StreamChatComponent";
import styles from "../../styles/client/RequestDetailsPage.module.css";
import useClientAuthCheck from "../../hooks/useClientAuthCheck";
import api from "../../utils/clientApi";

const RequestDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestId = searchParams.get("id"); // Retrieve the requestId from the URL
  const [requestDetails, setRequestDetails] = useState(null); // State to hold request details
  const [userToken, setUserToken] = useState(null); // State to hold the user token
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Use authentication check to get user data
  const { isAuthenticated, loading: authLoading, user } = useClientAuthCheck();

  useEffect(() => {
    if (authLoading) return; // Wait until the authentication status is loaded

    if (!isAuthenticated) {
      console.error("User is not authenticated. Redirecting...");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchRequestDetails = async () => {
      try {
        const response = await api.get(`/api/request/${requestId}`);
        if (response.data.success) {
          setRequestDetails(response.data.data); // Set request details
        } else {
          setError(response.data.message || "Failed to fetch request details");
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError("You are not authorized to view this request");
        } else {
          setError("An error occurred while fetching the request details");
        }
      }
    };

    const fetchUserToken = async () => {
      try {
        const response = await api.post(`${API_URL}/generate-user-token`, {
          id: user.id, // Use the user's ID from the auth context
        });
        setUserToken(response.data.token);
        
      } catch (error) {
        console.error("Failed to fetch user token:", error);
      }
    };

    // Fetch both request details and user token
    Promise.all([fetchRequestDetails(), fetchUserToken()]).finally(() => {
      setLoading(false);
    });
  }, [authLoading, isAuthenticated, navigate, requestId, user]);

  if (authLoading || loading) {
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
          onClick={() => navigate("/dashboard")}
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
        <h1 className={styles.title}>קריאה {requestId}</h1>
        <Button
          variant="contained"
          color="error"
          className={styles.cancelButton}
          onClick={() => console.log("Cancel request logic here")}
        >
          ביטול
        </Button>
      </Box>

      {/* Request Details */}
      <Box className={styles.details}>
        <p>
          <strong>בתחום:</strong> {requestDetails.field || "Unknown Field"}
        </p>
        <p>
          <strong>בנושא:</strong> {requestDetails.subject || "Unknown Subject"}
        </p>
        <p>
          <strong>מיקום:</strong> {requestDetails.city || "Unknown Location"}
        </p>
        <p>
          <strong>מועד העבודה:</strong>{" "}
          {new Date(requestDetails.date).toLocaleString() || "Unknown Date"}
        </p>
        <p>
          <strong>הערת לקוח:</strong> {requestDetails.comment || "No Notes"}
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
        <Button
          variant="contained"
          className={styles.backButton}
          onClick={() => navigate("/dashboard")}
        >
          חזור
        </Button>
      </Box>
    </Box>
  );
};

export default RequestDetailsPage;
