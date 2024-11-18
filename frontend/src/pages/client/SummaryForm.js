import React from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import "../../styles/client/SummaryForm.css"; // Custom CSS for styling

const SummaryForm = () => {
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
          חשמלאי
        </Typography>
      </Box>

      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          בנושא
        </Typography>
        <Typography variant="body1" className="summary-form-value">
          התקנת שקע
        </Typography>
      </Box>

      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          מיקום העבודה
        </Typography>
        <Typography variant="body1" className="summary-form-value">
          שלמה המלך 14, תל אביב
        </Typography>
      </Box>

      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          מועד העבודה
        </Typography>
        <Typography variant="body1" className="summary-form-value">
          16/04/2024 21:30
        </Typography>
      </Box>

      <Box className="summary-form-field">
        <Typography variant="subtitle1" className="summary-form-label">
          הערת לקוח
        </Typography>
        <TextField
          multiline
          rows={6}
          value="אני צריך התקנה של שקע חשמל ליד המקרר, יש לי קיר גבס."
          className="summary-form-textarea"
          sx={{
            readOnly: true, // Make the text area readonly
          }}
        />
      </Box>

      <Box className="appstart-footer">
        <Button
          variant="contained"
          className="submit-button"
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
