import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import "../../styles/client/AboutForm.css"; // Add your custom CSS here

const AboutForm = () => {
  const [fullName, setFullName] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("054");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    console.log({
      fullName,
      phone: `${phonePrefix}${phoneNumber}`,
      comment,
    });
  };

  return (
    <Box className="about-form-container">
      {/* Header */}
      <h2 className="about-form-title">קצת עליך</h2>

      {/* Full Name Field */}
      <Box className="about-form-field">
        <label>שם פרטי ומשפחה</label>
        <TextField
          
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="הקלד את שמך המלא"
          fullWidth
          className="about-form-input"
        />
      </Box>

      {/* Phone Number Field */}
      <Box className="about-form-field phone-field">
  <label>טלפון</label>
  <Box className="phone-number-container">
  <TextField
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      placeholder="123 4567"
      className="phone-number-input"
      fullWidth
    />
    <Select
      value={phonePrefix}
      onChange={(e) => setPhonePrefix(e.target.value)}
      className="phone-prefix-select"
    >
      <MenuItem value="054">054</MenuItem>
      <MenuItem value="050">050</MenuItem>
      <MenuItem value="052">052</MenuItem>
      {/* Add more prefixes as needed */}
    </Select>
    
  </Box>
</Box>


      {/* Comment Field */}
      <Box className="about-form-field">
        <label>הערה</label>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="כתוב הערה כאן..."
          fullWidth
          multiline
          rows={8}
          className="about-form-textarea"
        />
      </Box>

      {/* Submit Button */}
      <Button
        variant="contained"
        className="about-form-submit"
        onClick={handleSubmit}
        sx={{
            borderRadius: "14px", // Apply border-radius
            fontSize: "1.6rem", // Medium font size
          }}
      >
        חבר לי מומחה
      </Button>
    </Box>
  );
};

export default AboutForm;
