import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Button,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
} from "@mui/material";
import StreamChatComponent from "../../components/client/StreamChatComponent";
import styles from "../../styles/client/RequestDetailsPage.module.css";
import useClientAuthCheck from "../../hooks/useClientAuthCheck";
import api from "../../utils/clientApi";
import { NotificationProvider } from "../../contexts/NotificationContext";


const RequestDetailsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const requestId = searchParams.get("id");
    const [requestDetails, setRequestDetails] = useState(null);
    const [quotations, setQuotations] = useState([]);
    const [userToken, setUserToken] = useState(sessionStorage.getItem("clientChatToken"));
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
                    setRequestDetails(response.data.data.request);
                    setQuotations(response.data.data.quotations);
                } else {
                    setError(response.data.message || "Failed to fetch request details");
                }
            } catch (error) {
                setError("An error occurred while fetching the request details");
            }
        };

        const fetchUserToken = async () => {
            if (!userToken) {
                try {
                    const response = await api.post("/api/generate-user-token", {
                        id: user.id,
                        type:"client",
                    });
                    const token = response.data.token;
                    sessionStorage.setItem("clientChatToken", token); // Save token to session storage with new name
                    setUserToken(token);
                } catch (error) {
                    console.error("Failed to fetch user token:", error);
                    setError("Failed to initialize chat.");
                }
            }
        };

        Promise.all([fetchRequestDetails(), fetchUserToken()]).finally(() => {
            setLoading(false);
        });
    }, [authLoading, isAuthenticated, navigate, requestId, user, userToken]);

    const handleSelectProfessional = async (professionalId) => {
        try {
            const response = await api.put("/api/request/select-professional", {
                requestId,
                professionalId,
            });

            if (response.data.success) {
                alert("Professional selected successfully!");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error selecting professional:", error);
            alert("Failed to select professional.");
        }
    };

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
                <Typography variant="h6">{error}</Typography>
                <Button variant="contained" onClick={() => navigate("/dashboard")} className={styles.backButton}>
                    חזור
                </Button>
            </Box>
        );
    }

    return (
        <NotificationProvider userId={user?.id} userType="client">

        <Box className={styles.pageContainer}>
            {/* Header */}
            <Box className={styles.header}>
                <Typography variant="h4" className={styles.title}>
                    קריאה {requestId}
                </Typography>
            </Box>

            {/* Request Details */}
            <Box className={styles.details}>
                <Typography>
                    <strong>City:</strong> {requestDetails.city || "Unknown City"}
                </Typography>
                <Typography>
                    <strong>Date:</strong> {new Date(requestDetails.date).toLocaleString() || "Unknown Date"}
                </Typography>
                <Typography>
                    <strong>Comment:</strong> {requestDetails.comment || "No Notes"}
                </Typography>
            </Box>

            {/* Quotations Section */}
            <Box className={styles.quotationsSection}>
                <Typography variant="h5" className={styles.quotationsTitle}>
                    הצעות מחיר
                </Typography>
                <List>
                    {quotations.map((q) => (
                        <ListItem
                            key={q.professionalId}
                            className={styles.quotationItem}
                            secondaryAction={
                                <Button variant="contained" onClick={() => handleSelectProfessional(q.professionalId)}>
                                    בחר
                                </Button>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={q.image} alt={q.name} />
                            </ListItemAvatar>
                            <ListItemText primary={q.name} secondary={`Price: ${q.price} ₪`} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Chat Section */}
            <Box className={styles.chatSection}>
                <Typography variant="h6" className={styles.chatTitle}>
                    התכתבויות
                </Typography>
                <div className={styles.chatContainer}>
                    {userToken ? (
                        <StreamChatComponent
                            apiKey="nr6puhgsrawn" // Replace with your Stream API key
                            userToken={userToken}
                            channelId={`request_${requestId}`}
                            userID={user.id}
                            userRole="client"
                        />
                    ) : (
                        <Typography>Loading chat...</Typography>
                    )}
                </div>
            </Box>
        </Box>
        </NotificationProvider>

    );
};

export default RequestDetailsPage;
