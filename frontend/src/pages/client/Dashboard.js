import React, { useState,useEffect } from "react";
import { Button, ButtonBase, Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';

import styles from "../../styles/client/Dashboard.module.css";
import useClientAuthCheck from '../../hooks/useClientAuthCheck';
import { useLanguage } from '../../contexts/LanguageContext';

const Dashboard = () => {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false); // State to handle popup visibility
  const { translation } = useLanguage();

  const { isAuthenticated, loading ,user} = useClientAuthCheck();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) 
        {
          console.log("yes");

        } 

    else {
        console.log("NO");
    }
}, [loading, isAuthenticated, navigate]);

const handleNavigateToMyRequests = () => {
  navigate('/dashboard/my-requests'); // Navigate to the "My Requests" page
};


if (loading || !translation) 
    {
    return (
        <div className={styles['spinner-overlay']}>
            <div className={styles['spinner']}></div>
        </div>
    );
}
const handleNavigateToMain = () => {
  navigate("/main"); // Navigate to the "Main" page
};
  return (
    <Box className={styles.clientDContainer}>
      {/* Header */}
      <Box className={styles.clientDHeader}>
        {/* Translate Icon */}
        <div className={styles.clientDIconButton}>
          <ButtonBase onClick={() => setShowPopup(true)}> {/* Show popup on click */}
            <img
              src="/images/ct/language-icon.png" // Replace with your actual path
              alt="Language Icon"
              className={styles.clientDIcon}
            />
          </ButtonBase>
        </div>

        {/* Title and Description */}
        <Box className={styles.clientDContent}>
          <h1 className={styles.clientDTitle}>I Need</h1>
          <p className={styles.clientDDescription}>כל המומחים במקום אחד</p>
        </Box>
      </Box>

      {/* Worker Image */}
      <Box className={styles.clientDImageContainer}>
        <img
          src="/images/ct/worker3.png"
          alt="Worker"
          className={styles.clientDWorkerImage}
        />
      </Box>

      {/* Buttons */}
      <Box className={styles.clientDButtonsContainer}>
        <Button
          variant="contained"
          className={`${styles.clientDButton} ${styles.clientDNewRequestButton}`}
          onClick={handleNavigateToMain} // Navigate to /main

          sx={{
            borderRadius: "14px", // Apply border-radius
            fontSize: "1.6rem", // Medium font size
          }}
        >
          פתח קריאה חדשה
        </Button>
        <Button
          variant="contained"
          className={`${styles.clientDButton} ${styles.clientDMyRequestsButton}`}
          onClick={handleNavigateToMyRequests}
          sx={{
            borderRadius: "14px", // Apply border-radius
            fontSize: "1.6rem", // Medium font size
          }}
        >
          הקריאות שלי
        </Button>
        <Button
          variant="contained"
          className={`${styles.clientDButton} ${styles.clientDClosedRequestsButton}`}
          sx={{
            borderRadius: "14px", // Apply border-radius
            fontSize: "1.6rem", // Medium font size
          }}
        >
          קריאות סגורות
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
