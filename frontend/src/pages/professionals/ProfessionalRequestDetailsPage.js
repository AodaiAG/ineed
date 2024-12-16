import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Box,
    CircularProgress,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import StreamChatComponent from "../../components/client/StreamChatComponent";
import api from "../../utils/api";
import useAuthCheck from "../../hooks/useAuthCheck";
import styles from "../../styles/RequestDetailsPage.module.css";

const ProfessionalRequestDetailsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { id: requestId } = useParams();
    const [requestDetails, setRequestDetails] = useState(null);
    const [userToken, setUserToken] = useState(sessionStorage.getItem("profChatToken"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quotation, setQuotation] = useState("");
    const [isEditing, setIsEditing] = useState(true);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const { user, isAuthenticated, loading: authLoading } = useAuthCheck();

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        const fetchRequestDetails = async () => {
            try {
                const response = await api.get(`/api/professionals/request/${requestId}`);
                if (response.data.success) {
                    setRequestDetails(response.data.data);
                    console.table(response.data.data);
                    setQuotation(response.data.data.quotation || "");
                } else {
                    setError(response.data.message || "Failed to fetch request details");
                }
            } catch (error) {
                setError("An error occurred while fetching the request details");
            }
        };

        const joinChatChannel = async () => {
            if (!userToken) {
                try {
                    const response = await api.post(`/api/professionals/join-chat`, {
                        userId: String(user.profId),
                        requestId,
                    });
                    const responseToken = await api.post(`/api/generate-user-token`, {
                        id: String(user.profId),
                        type: "prof",
                    });
                    if (response.data.success) {
                        sessionStorage.setItem("profChatToken", responseToken.data.token);
                        setUserToken(responseToken.data.token);
                    } else {
                        setError("Failed to join the chat");
                    }
                } catch (error) {
                    setError("An error occurred while joining the chat");
                }
            }
        };

        Promise.all([fetchRequestDetails(), joinChatChannel()]).finally(() => {
            setLoading(false);
        });
    }, [authLoading, isAuthenticated, navigate, requestId, user, userToken]);

    const handleQuotationSubmit = async () => {
        try {
            const response = await api.post(`/api/professionals/quotation`, {
                requestId,
                quotation: parseFloat(quotation),
            });

            if (response.data.success) {
                setIsEditing(false);
                alert("Quotation submitted successfully.");
            } else {
                setError("Failed to process quotation");
            }
        } catch (error) {
            console.error("Error submitting quotation:", error);
            alert("An error occurred while submitting the quotation.");
        }
    };

    const handleCancelRequest = async () => {
        try {
            await api.post("/api/professionals/cancel-request", {
                requestId,
                reason: cancelReason,
            });

            alert("The request has been canceled successfully.");
            setShowCancelDialog(false);
            navigate("/pro/expert-interface");
        } catch (error) {
            console.error("Error canceling request:", error);
            alert("Failed to cancel the request.");
        }
    };

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
                <Typography>{error}</Typography>
                <Button variant="contained" onClick={() => navigate("/pro/expert-interface")} className={styles.backButton}>
                    חזור
                </Button>
            </Box>
        );
    }

    return (
        <Box className={styles.pageContainer}>
            <Box className={styles.header}>
                <Typography variant="h4" className={styles.title}>
                    פרטי הקריאה
                </Typography>
                {requestDetails.professionalId === user.profId && (
                    <Button variant="contained" color="error" onClick={() => setShowCancelDialog(true)} className={styles.cancelButton}>
                        ביטול
                    </Button>
                )}
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
                    <strong>מועד העבודה:</strong> {new Date(requestDetails.date).toLocaleString() || "לא ידוע"}
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
                            apiKey="nr6puhgsrawn"
                            userToken={userToken}
                            channelId={`request_${requestId}`}
                            userID={String(user.profId)}
                            userRole="prof"
                        />
                    ) : (
                        <Typography>Loading chat...</Typography>
                    )}
                </div>
            </Box>
            {/* Quotation Section */}
            <Box className={styles.quotationSection}>
                {isEditing ? (
                    <Box>
                        <TextField
                            label="הצעת מחיר"
                            value={quotation}
                            onChange={(e) => setQuotation(e.target.value)}
                            variant="outlined"
                            type="number"
                        />
                        <Button
                            variant="contained"
                            onClick={handleQuotationSubmit}
                            disabled={!quotation || parseFloat(quotation) <= 0}
                        >
                            {quotation ? "עדכן" : "השתבץ"}
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Typography>הצעת מחיר שהצעת: {quotation} ש"ח</Typography>
                        <Button variant="contained" onClick={() => setIsEditing(true)}>
                            עדכן
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Cancel Request Dialog */}
            <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
                <DialogTitle>ביטול הקריאה</DialogTitle>
                <DialogContent>
                    <TextField
                        label="סיבת הביטול"
                        multiline
                        rows={4}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCancelDialog(false)} color="primary">
                        ביטול
                    </Button>
                    <Button onClick={handleCancelRequest} color="error" disabled={!cancelReason}>
                        שלח
                    </Button>
                </DialogActions>
            </Dialog>

            <Box className={styles.footer}>
                <Button variant="contained" className={styles.backButton} onClick={() => navigate("/pro/expert-interface")}>
                    חזור
                </Button>
            </Box>
        </Box>
    );
};

export default ProfessionalRequestDetailsPage;
