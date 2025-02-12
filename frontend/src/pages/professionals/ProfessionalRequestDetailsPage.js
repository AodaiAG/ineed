import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  TextField,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import StreamChatComponent from "../../components/client/StreamChatComponent";
import FinishRequestComponent from "../../components/professionals/FinishRequestComponent";
import api from "../../utils/api";
import useAuthCheck from "../../hooks/useAuthCheck";
import styles from "../../styles/RequestDetailsPage.module.css";

const ProfessionalRequestDetailsPage = () => {
  const navigate = useNavigate();
  const { id: requestId } = useParams();
  const [requestDetails, setRequestDetails] = useState(null);
  const [profession, setProfession] = useState(null);
  const [quotation, setQuotation] = useState("");
  const [userToken, setUserToken] = useState(sessionStorage.getItem("profChatToken"));
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSelectedProfessional, setIsSelectedProfessional] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Expandable Sections
  const [showDetails, setShowDetails] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);

  const { user, isAuthenticated, loading: authLoading } = useAuthCheck();
  const language = "he";

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
          const requestData = response.data.data;
          setRequestDetails(requestData);
          setQuotation(requestData.quotation || "");

          if (requestData.professionalId === user.profId) {
            setIsSelectedProfessional(true);
          }

          const quotationsResponse = await api.get(`/api/professionals/request/${requestId}/quotations`);
          if (quotationsResponse.data.success) {
            setQuotations(quotationsResponse.data.data);
          }

          const professionResponse = await api.get(`/api/professionals/profession/${requestData.jobRequiredId}/${language}`);
          if (professionResponse.data.success) {
            setProfession(professionResponse.data.data);
          } else {
            setProfession({ main: "לא ידוע", sub: "לא ידוע" });
          }
        } else {
          setError(response.data.message || "Failed to fetch request details");
        }
      } catch (error) {
        setError("An error occurred while fetching the request details");
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchRequestDetails()]).finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, navigate, requestId]);

  // ✅ Restored function
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

  return (
    <Box className={styles.pageContainer}>
      <Button variant="contained" className={styles.cancelButton} onClick={() => setShowCancelDialog(true)}>
        ביטול
      </Button>
            {/* Header Section */}
            <Box className={styles.header}>
        <Typography className={styles.requestNumber}>{requestDetails.id}</Typography>
        <Typography className={styles.title}>קריאה</Typography>
      </Box>

      {/* Expandable Request Details */}
      <Box className={styles.details}>
          <Typography><strong>בתחום:</strong> {profession?.main || "טוען..."}</Typography>
          <Typography><strong>בנושא:</strong> {profession?.sub || "טוען..."}</Typography>
          <Typography><strong>מיקום:</strong> {requestDetails.city || "לא ידוע"}</Typography>
          <Typography><strong>מועד:</strong> {new Date(requestDetails.date).toLocaleString() || "לא ידוע"}</Typography>
          <Typography><strong>הערת לקוח:</strong> {requestDetails.comment || "אין הערות"}</Typography>
        </Box>

      {/* Expandable Chat Section */}
      <Box className={styles.expandableHeader} onClick={() => setShowChat(!showChat)}>
        <Typography>צ׳אט עם הלקוח</Typography>
        {showChat ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>
      <Collapse in={showChat} className={styles.chatCollapseContainer}>
        <Box className={styles.chatContainer}>
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
        </Box>
      </Collapse>

      {/* Expandable Quotation Section */}
      <Box className={styles.expandableHeader} onClick={() => setShowQuotation(!showQuotation)}>
        <Typography>הצעת מחיר</Typography>
        {showQuotation ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>
      <Collapse in={showQuotation} className={styles.quotationCollapseContainer}>
        <Box className={styles.quotationSection}>
          <Box className={styles.quotationInputContainer}>
            <TextField
              label="הצעת מחיר"
              value={quotation}
              onChange={(e) => setQuotation(e.target.value)}
              variant="outlined"
              type="number"
            />
            <Button variant="contained" onClick={handleQuotationSubmit} className={styles.quotationButton}>
              עדכן
            </Button>
          </Box>
        </Box>
      </Collapse>

      <Box className={styles.buttonsRow}>
        <Button variant="contained" className={styles.backButton} onClick={() => navigate("/pro/expert-interface")}>
          חזור
        </Button>
        {isSelectedProfessional && (
          <Button variant="contained" className={styles.finalizeButton} onClick={() => setShowFinishDialog(true)}>
            סיום העבודה
          </Button>
        )}
      </Box>

      <FinishRequestComponent open={showFinishDialog} onClose={() => setShowFinishDialog(false)} requestId={requestId} clientId={requestDetails.clientId} />
    </Box>
  );
};

export default ProfessionalRequestDetailsPage;
