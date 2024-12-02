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
  const requestId = searchParams.get("id");
  const [requestDetails, setRequestDetails] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use authentication check to get user data
  const { isAuthenticated, loading: authLoading, user } = useClientAuthCheck();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      console.error("User is not authenticated. Redirecting...");
      navigate("/login");
      return;
    }

    const fetchRequestDetails = async () => {
      try {
        const response = await api.get(`/api/request/${requestId}`);
        if (response.data.success) {
          setRequestDetails(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch request details");
        }
      } catch (error) {
        setError("An error occurred while fetching the request details");
      }
    };

    const fetchUserToken = async () => {
      try {
        const response = await api.post(`${API_URL}/generate-user-token`, {
          id: user.id,

        });
        setUserToken(response.data.token);
      } catch (error) {
        console.error("Failed to fetch user token:", error);
      }
    };

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

  const { channelId } = requestDetails;

  return (
    <Box className={styles.pageContainer}>
      {/* Header */}
      <Box className={styles.header}>
        <h1 className={styles.title}>קריאה {requestId}</h1>
      </Box>

      {/* Request Details */}
      <Box className={styles.details}>
        <p>
          <strong>City:</strong> {requestDetails.city || "Unknown City"}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(requestDetails.date).toLocaleString() || "Unknown Date"}
        </p>
        <p>
          <strong>Comment:</strong> {requestDetails.comment || "No Notes"}
        </p>
      </Box>

      {/* Chat Section */}
      <Box className={styles.chatSection}>
        <h2 className={styles.chatTitle}>התכתבויות</h2>
        <div className={styles.chatContainer}>
          {userToken ? (
            <StreamChatComponent
              apiKey="4kp4vrvuedgh" // Replace with your Stream API key
              userToken={userToken}
              channelId={`request_${requestId}`} // Use the channel ID
              userID={user.id}
              userRole="client" // Specify the role as 'client' for clients

            />
          ) : (
            <p>Loading chat...</p>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default RequestDetailsPage;
