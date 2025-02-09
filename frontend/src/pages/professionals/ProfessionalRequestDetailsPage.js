import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import StreamChatComponent from "../../components/client/StreamChatComponent";
import FinishRequestComponent from "../../components/professionals/FinishRequestComponent";
import api from "../../utils/api";
import useAuthCheck from "../../hooks/useAuthCheck";
import styles from "../../styles/RequestDetailsPage.module.css";

const ProfessionalRequestDetailsPage = () => {
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
  const [showFinishDialog, setShowFinishDialog] = useState(false);

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
          setQuotation(response.data.data.quotation || "");
        } else {
          setError(response.data.message || "Failed to fetch request details");
        }
      } catch (error) {
        setError("An error occurred while fetching the request details");
      } finally {
        setLoading(false);
      }
    };
    const fetchUserToken = async () => {
      if (!userToken) {
          try {
              console.log("Fetching user token...");
              const response = await api.post("/api/generate-user-token", {
                  id: String(user.profId),
                  type: "prof",
              });
              const token = response.data.token;
              sessionStorage.setItem("profChatToken", token);
              setUserToken(token);
              console.log("User token fetched successfully:", token);
          } catch (error) {
              console.error("Failed to fetch user token:", error);
              setError("Failed to initialize chat.");
          }
      }
  };

  Promise.all([fetchRequestDetails(), fetchUserToken()]).finally(() => setLoading(false));

    
  }, [authLoading, isAuthenticated, navigate, requestId,userToken]);

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

  if (loading || authLoading) {
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
          עדכון הקריאה
        </Typography>
        {requestDetails.professionalId === user.profId && (
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowCancelDialog(true)}
            className={styles.cancelButton}
          >
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
          <strong>מיקום העבודה:</strong> {requestDetails.city || "לא ידוע"}
        </Typography>
        <Typography>
          <strong>מועד העבודה:</strong> {new Date(requestDetails.date).toLocaleString() || "לא ידוע"}
        </Typography>
        <Typography>
          <strong>הערות:</strong> {requestDetails.comment || "אין הערות"}
        </Typography>
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
            <Button variant="contained" onClick={handleQuotationSubmit} disabled={!quotation || parseFloat(quotation) <= 0}>
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
            <Typography>Loaddddng chat...</Typography>
          )}
        </div>
      </Box>

      {/* Finish Button */}
      {requestDetails.professionalId === user.profId && (
        <Button variant="contained" color="primary" onClick={() => setShowFinishDialog(true)} className={styles.finishButton}>
          סיום
        </Button>
      )}

      {/* Finish Request Component */}
      <FinishRequestComponent
        open={showFinishDialog}
        onClose={() => setShowFinishDialog(false)}
        requestId={requestId}
        clientId={requestDetails.clientId}
      />

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
