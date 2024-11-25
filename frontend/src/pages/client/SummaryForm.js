import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import "../../styles/client/SummaryForm.css"; // Custom CSS for styling
import { useNavigate } from "react-router-dom"; // Assuming navigation is used
import axios from "axios";
import { API_URL } from '../../utils/constans';
import api from '../../utils/clientApi';
import { useLanguage } from "../../contexts/LanguageContext"; // Import useLanguage for translations



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
        const handleReturn =() => 
        {
          navigate("/about");
        }
  const handleSubmit = () => {
    const fullPhoneNumber = `${phonePrefix}${phoneNumber}`;
    console.log("Full Phone Number:", fullPhoneNumber);
    try {
      axios.post(`${API_URL}/professionals/send-sms`, {
        phoneNumber: fullPhoneNumber,
        message: translation.verificationCodeMessage + " {code}",
      });

      

      navigate("/sms");
    } catch (error) {
      console.error("Failed to send SMS:", error);
      alert(translation.failedToSendSmsMessage);
    }
   
  };

  return (
    <Box className="summary-form-container">
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
          {summaryData.profession || "לא הוזן"}
        </Typography>
      </Box>

      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          בנושא
        </Typography>
        <Typography variant="body1" className="summary-form-value">
          {summaryData.subject || "לא הוזן"}
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
          {summaryData.date || "לא הוזן"}
        </Typography>
      </Box>

      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          הערת לקוח
        </Typography>
        <TextField
          multiline
          rows={6}
          value={summaryData.comment || "אין הערות"}
          className="summary-form-textarea"
          sx={{
            readOnly: true, // Make the text area readonly
          }}
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
