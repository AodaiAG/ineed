import React, { useState } from "react";
import { Box, Button, ButtonBase } from "@mui/material";
import "../../styles/client/AppStart.css"; // Import your custom CSS file
import LanguageSelectionPopup from "../../components/LanguageSelectionPopup"; // Import your popup component

const AppStart = () => {
  const [showPopup, setShowPopup] = useState(false); // State to toggle popup visibility

  return (
    <Box className="appstart-container">
      {/* Header */}
      <Box className="appstart-header">
        {/* Translate Icon */}
        <div className="appstart-icon-button">
          <ButtonBase onClick={() => setShowPopup(true)}> {/* Show popup on click */}
            <img
              src="/images/ct/language-icon.png" // Replace with your actual path
              alt="Language Icon"
              className="appstart-icon"
            />
          </ButtonBase>
        </div>

        {/* Title and Description */}
        <Box className="appstart-content">
          <h1 className="appstart-title">I Need</h1>
          <p className="appstart-description">כל המומחים במקום אחד</p>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className="appstart-main">
        <img
          src="/images/ct/worker3.png" // Replace with your actual path
          alt="Worker"
          className="appstart-image"
        />
      </Box>

      {/* Footer */}
      <Box className="appstart-footer">
        <Button
          variant="contained"
          className="service-provider-button"
          sx={{
            backgroundColor: "#000000",
            color: "#FFFFFF",
            borderRadius: "14px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            width: "45%",
          }}
        >
          נותן שירות
        </Button>
        <Button
          variant="contained"
          className="client-button"
          sx={{
            backgroundColor: "#007BFF",
            color: "#FFFFFF",
            borderRadius: "14px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            width: "45%",
          }}
        >
          לקוח
        </Button>
      </Box>

      {/* Language Selection Popup */}
      {showPopup && (
        <LanguageSelectionPopup
          onClose={() => setShowPopup(false)} // Close popup on action
            backgroundColor="#1783E0" // Blue background for the client side

        />
      )}
    </Box>
  );
};

export default AppStart;
