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
    Radio,
    RadioGroup,
    FormControlLabel,
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
    const [selectedProfessionalId, setSelectedProfessionalId] = useState(null);
    const [confirmedProfessionalId, setConfirmedProfessionalId] = useState(null);
    const [userToken, setUserToken] = useState(sessionStorage.getItem("clientChatToken"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Authentication check
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
                console.log("Fetching request details for requestId:", requestId);
                const response = await api.get(`/api/request/${requestId}`);
                console.log("Response from fetchRequestDetails:", response.data);

                if (response.data.success) {
                    const request = response.data.data.request;
                    console.log("Fetched request details:", request);

                    setRequestDetails(request);
                    setQuotations(response.data.data.quotations);

                    // Set the confirmed professional if it exists
                    if (request.professionalId) {
                        setSelectedProfessionalId(request.professionalId);
                        setConfirmedProfessionalId(request.professionalId);
                        console.log("Confirmed Professional ID set to:", request.professionalId);
                    } else {
                        console.log("No professional ID found in the request");
                    }
                } else {
                    setError(response.data.message || "Failed to fetch request details");
                }
            } catch (error) {
                console.error("Error while fetching request details:", error);
                setError("An error occurred while fetching the request details");
            }
        };

        fetchRequestDetails().finally(() => setLoading(false));
    }, [authLoading, isAuthenticated, navigate, requestId, user]);

    const handleSelectProfessional = async () => {
        console.log("Selecting professional with ID:", selectedProfessionalId);
        try {
            const response = await api.put("/api/request/select-professional", {
                requestId,
                professionalId: selectedProfessionalId,
            });

            if (response.data.success) {
                alert("Professional selected successfully!");

                console.log("Notification for previous professional:", confirmedProfessionalId);
                console.log("Notification for new professional:", selectedProfessionalId);

                // Send notifications using the new API structure
                if (confirmedProfessionalId && confirmedProfessionalId !== selectedProfessionalId) {
                    await api.post("/api/notifications", {
                        recipientId: confirmedProfessionalId.toString(),
                        recipientType: "professional",
                        messageKey: "notifications.professionalDeselected",
                        requestId,
                        action: `/pro/requests/${requestId}`,
                        isRead: false,
                    });
                }

                // Confirm the new professional selection
                setConfirmedProfessionalId(selectedProfessionalId);
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
                    <RadioGroup value={selectedProfessionalId} onChange={(e) => setSelectedProfessionalId(e.target.value)}>
                        {quotations.map((q) => (
                            <ListItem key={q.professionalId} className={styles.quotationItem}>
                                <FormControlLabel
                                    value={q.professionalId}
                                    control={<Radio disabled={confirmedProfessionalId === q.professionalId} />}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            <ListItemAvatar>
                                                <Avatar src={q.image} alt={q.name} />
                                            </ListItemAvatar>
                                            <ListItemText primary={q.name} secondary={`Price: ${q.price} ₪`} />
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </RadioGroup>
                    <Button variant="contained" onClick={handleSelectProfessional} disabled={!selectedProfessionalId || selectedProfessionalId === confirmedProfessionalId}>
                        {confirmedProfessionalId ? "החלף" : "בחר"}
                    </Button>
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
