import React from "react";
import { Box, Button, ButtonBase } from "@mui/material";
import "./HomePage.css"; // Import your custom CSS file

const HomePage = () => {
  return (
    <Box className="home-container">
      {/* Header */}
      <Box className="home-header">
        {/* Translate Image */}
        <div className="header-icon-button">
        <ButtonBase>
        <img
            src="/images/ct/language-icon.png" // Replace with your actual image path
            alt="Language Icon"
            className="header-icon"
          />
        </ButtonBase>
          
        </div>

        {/* Title and Description */}
        <Box className="header-content">
          <h1 className="home-title">I Need</h1>
          <p className="home-description">כל המומחים במקום אחד</p>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className="home-main">
        <img
          src="/images/ct/worker1.png" // Replace with your actual image path
          alt="Worker"
          className="home-image"
        />
      </Box>

      {/* Footer */}
      <Box className="home-footer">
        <Button variant="contained" color="secondary" sx={{
      borderRadius: "14px", // Apply border-radius
      fontSize: "1.6rem",          // Medium font size (default for "medium")
    }} className="footer-button ">
          קדימה
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
