import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, CircularProgress } from "@mui/material"; // Added CircularProgress
import "../../styles/client/SummaryForm.css"; // Custom CSS for styling
import { useNavigate } from "react-router-dom"; // Assuming navigation is used
import axios from "axios";
import { API_URL } from '../../utils/constans';
import api from '../../utils/clientApi';
import { useLanguage } from "../../contexts/LanguageContext"; // Import useLanguage for translations
import useClientAuthCheck from '../../hooks/useClientAuthCheck';
import { format } from "date-fns";
import { he } from "date-fns/locale"; // Import Hebrew locale if needed

const SummaryForm = () => {
  const navigate = useNavigate(); // For navigation
  const { translation } = useLanguage(); // Access translations

  // State for form data
  const [summaryData, setSummaryData] = useState({
    profession: "",
    subject: "",
    location: "",
    date: "",
    comment: "",
  });

  const [phonePrefix, setPhonePrefix] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { isAuthenticated, loading: authLoading, user } = useClientAuthCheck();
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      console.log("yes");
    } else {
      console.log("NO");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch data from sessionStorage when the component mounts
  useEffect(() => {
    const storedProfession = sessionStorage.getItem("domain") || "";
    const storedSubject = sessionStorage.getItem("mainProfession") || "";
    const storedLocation = sessionStorage.getItem("city") || "";
    const storedDate = sessionStorage.getItem("date") || "";
    const storedComment = sessionStorage.getItem("comment") || "";

    const storedPhonePrefix = sessionStorage.getItem("phonePrefix") || "";
    const storedPhoneNumber = sessionStorage.getItem("phoneNumber") || "";

    // Set the summary data and phone details in state
    setSummaryData({
      profession: storedProfession,
      subject: storedSubject,
      location: storedLocation,
      date: storedDate,
      comment: storedComment,
    });
    setPhonePrefix(storedPhonePrefix);
    setPhoneNumber(storedPhoneNumber);
  }, []);

  const handleReturn = () => {
    if (isAuthenticated) {
      navigate("/main");
    } else {
      navigate("/about");
    }
  };

  const handleSubmit = async () =>
     {
    setLoading(true); // Start loading
    try {

      console.log('at handle submit')
      
      if (isAuthenticated && user?.id) 
        {
        console.log("Authenticated user ID:", user.id);

        const requestDetails = {
          clientId: user.id, // Use user ID for the authenticated client
          jobRequiredId: JSON.parse(sessionStorage.getItem("subProfession"))?.id, // Use jobRequiredId from sessionStorage
          city: sessionStorage.getItem("city"),
          date: sessionStorage.getItem("date"),
          comment: summaryData.comment, // Use the updated comment
        };

        const submitRequestResponse = await api.post(`${API_URL}/submit_client_request`, requestDetails);

        if (submitRequestResponse.data.success) {
          console.log("Request submitted successfully!");
          navigate("/dashboard"); // Navigate to dashboard after saving client and request
        } else {
          console.error("Failed to submit client request");
          console.log(submitRequestResponse.data)
          alert(translation.failedToSubmitRequestMessage || "Failed to submit request.");
        }
      } else {
        console.log("User is not authenticated, sending SMS instead.");

        const fullPhoneNumber = `${phonePrefix}${phoneNumber}`;
        console.log("Full Phone Number:", fullPhoneNumber);

        await axios.post(`${API_URL}/professionals/send-sms`, {
          phoneNumber: fullPhoneNumber,
          message: translation.verificationCodeMessage + " {code}",
        });


    // ✅ Save a boolean in sessionStorage
    sessionStorage.setItem("saveRequest", "true"); // Stored as a string

      
        navigate("/sms");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert(translation.failedToSubmitRequestMessage || "Failed to submit request.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleCommentChange = (event) => {
    setSummaryData((prevState) => ({
      ...prevState,
      comment: event.target.value,
    }));
  };

  return (
    <Box className="summary-form-container" sx={{ position: "relative" }}>
      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Title */}
      <Typography variant="h4" className="summary-form-title">
        סכם לפני שליחה
      </Typography>

      {/* Fields */}
      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          בתחום
        </Typography>
        <Typography variant="body1" className="summary-form-value">
  {(() => {
    try {
      const parsedProfession =
        typeof summaryData.profession === "string"
          ? JSON.parse(summaryData.profession)
          : summaryData.profession;

      return parsedProfession?.domain?.trim() || "לא הוזן";
    } catch (error) {
      console.error("Failed to parse profession:", error);
      return "לא הוזן";
    }
  })()}
</Typography>

      </Box>

      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          בנושא
        </Typography>
        <Typography variant="body1" className="summary-form-value">
  {(() => {
    try {
      const parsedSubject =
        typeof summaryData.subject === "string"
          ? JSON.parse(summaryData.subject)
          : summaryData.subject;

      return parsedSubject?.main?.trim() || "לא הוזן";
    } catch (error) {
      console.error("Failed to parse subject:", error);
      return "לא הוזן";
    }
  })()}
</Typography>

      </Box>

      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          מיקום העבודה
        </Typography>
        <Typography variant="body1" className="summary-form-value">
          {summaryData.location || "לא הוזן"}
        </Typography>
      </Box>

      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          מועד העבודה
        </Typography>
        <Typography variant="body1" className="summary-form-value">
  {(() => {
    try {
      if (!summaryData.date) return "לא הוזן";

      const formattedDate = format(new Date(summaryData.date), "dd/MM/yyyy HH:mm", {
        locale: he, // Use Hebrew locale if needed
      });

      return formattedDate;
    } catch (error) {
      console.error("Failed to format date:", error);
      return "לא הוזן";
    }
  })()}
</Typography>
      </Box>

      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          הערת לקוח
        </Typography>
        <TextField
          multiline
          rows={6}
          value={summaryData.comment}
          onChange={handleCommentChange} // Added handler for changes
          className="summary-form-textarea"
        />
      </Box>

      {/* Buttons */}
      <Box className="appstart-footer">
        <Button
          variant="contained"
          className="submit-button"
          onClick={handleSubmit}
          sx={{
            color: "#FFFFFF",
            borderRadius: "14px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            width: "45%",
          }}
        >
          המשך
        </Button>
        <Button
          variant="contained"
          className="back-button"
          onClick={handleReturn}
          sx={{
            color: "#FFFFFF",
            borderRadius: "14px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            width: "45%",
          }}
        >
          חזור
        </Button>
      </Box>
    </Box>
  );
};

export default SummaryForm;
