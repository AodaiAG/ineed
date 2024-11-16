import React from "react";
import { Box, Button, ButtonBase } from "@mui/material";
import "../../styles/client/HomePage.css"; // Import your custom CSS file

const AppStart = () => {
  return (
    <Box className="appstart-container">
      {/* Header */}
      <Box className="appstart-header">
        {/* Translate Icon */}
        <div className="appstart-icon-button">
          <ButtonBase>
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
          src="/images/ct/worker1.png" // Replace with your actual path
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
    </Box>
  );
};

export default AppStart;
