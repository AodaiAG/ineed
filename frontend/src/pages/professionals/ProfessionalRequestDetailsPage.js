import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  TextField,
} from "@mui/material";
import StreamChatComponent from "../../components/client/StreamChatComponent";
import api from "../../utils/api";
import useAuthCheck from "../../hooks/useAuthCheck";
import styles from "../../styles/RequestDetailsPage.module.css";

const ProfessionalRequestDetailsPage = () => {
  const navigate = useNavigate();
  const { id: requestId } = useParams();
  const [requestDetails, setRequestDetails] = useState(null);
  const [profession, setProfession] = useState(null); // Store profession data
  const [quotation, setQuotation] = useState(""); // Store quotation amount
  const [userToken, setUserToken] = useState(sessionStorage.getItem("profChatToken"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(true); // Quotation edit state

  const { user, isAuthenticated, loading: authLoading } = useAuthCheck();
  const language = "he"; // Change based on user preference

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

          // Fetch profession details using jobRequiredId
          const professionResponse = await api.get(`/api/professionals/profession/${response.data.data.jobRequiredId}/${language}`);
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

    fetchRequestDetails();
  }, [authLoading, isAuthenticated, navigate, requestId]);

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
      {/* Header Section */}
      <Box className={styles.header}>
        <Typography className={styles.requestNumber}>{requestDetails.id}</Typography>
        <Typography className={styles.title}>קריאה</Typography>
      </Box>

      {/* Request Details */}
      <Box className={styles.details}>
        <Typography>
          <strong>בתחום:</strong> {profession?.main || "טוען..."}
        </Typography>
        <Typography>
          <strong>בנושא:</strong> {profession?.sub || "טוען..."}
        </Typography>
        <Typography>
          <strong>מיקום:</strong> {requestDetails.city || "לא ידוע"}
        </Typography>
        <Typography>
          <strong>מועד:</strong> {new Date(requestDetails.date).toLocaleString() || "לא ידוע"}
        </Typography>
        <Typography>
          <strong>הערת לקוח:</strong> {requestDetails.comment || "אין הערות"}
        </Typography>
      </Box>

      {/* Chat Section */}
      <Box className={styles.chatContainer}>
        <StreamChatComponent
          apiKey="nr6puhgsrawn"
          userToken={userToken}
          channelId={`request_${requestId}`}
          userID={String(user.profId)}
          userRole="prof"
        />
      </Box>

      {/* Quotation Section */}
      <Box className={styles.quotationSection}>
        {isEditing ? (
          <Box className={styles.quotationInputContainer}>
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
              className={styles.quotationButton}
            >
              {quotation ? "עדכן" : "השתבץ"}
            </Button>
          </Box>
        ) : (
          <Box className={styles.quotationDisplay}>
            <Typography>הצעת מחיר שהצעת: {quotation} ש"ח</Typography>
            <Button variant="contained" onClick={() => setIsEditing(true)} className={styles.quotationButton}>
              עדכן
            </Button>
          </Box>
        )}
      </Box>

      {/* Quotation Note */}
      <Typography className={styles.quotationText}>* הצעה מקסימלית 700 ש"ח</Typography>

      {/* Back Button */}
      <Button variant="contained" className={styles.backButton} onClick={() => navigate("/pro/expert-interface")}>
        חזור
      </Button>
    </Box>
  );
};

export default ProfessionalRequestDetailsPage;
