import React, { useState, useEffect } from "react";
import { Button, ButtonBase, Box, IconButton, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import styles from "../../styles/client/Dashboard.module.css";
import useClientAuthCheck from "../../hooks/useClientAuthCheck";
import { useLanguage } from "../../contexts/LanguageContext";
import NotificationComponent from "../../components/NotificationComponent";
import { NotificationProvider } from "../../contexts/NotificationContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false); // State to handle popup visibility
  const [showNotifications, setShowNotifications] = useState(false); // State to toggle notifications
  const { translation } = useLanguage();
  const { isAuthenticated, loading, user } = useClientAuthCheck();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      console.log("yes");
    } else {
      console.log("NO");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleNavigateToMyRequests = () => {
    navigate("/dashboard/my-requests");
  };

  const handleNavigateToMain = () => {
    navigate("/main");
  };

  if (loading || !translation) {
    return (
      <div className={styles["spinner-overlay"]}>
        <div className={styles["spinner"]}></div>
      </div>
    );
  }

  return (
    <NotificationProvider userId={user?.id} userType="client">
      <Box className={styles.clientDContainer}>
        {/* Header */}
        <Box className={styles.clientDHeader}>
          <Box className={styles.clientDIconContainer}>
            {/* Language Icon */}
            <ButtonBase onClick={() => setShowPopup(true)} className={styles.clientDIconButton}>
              <img
                src="/images/ct/language-icon.png"
                alt="Language Icon"
                className={styles.clientDIcon}
              />
            </ButtonBase>

            {/* Notification Icon */}
            <IconButton className={styles.notificationIcon} onClick={handleNotificationClick}>
              <Badge color="error" variant="dot">
                <NotificationsActiveIcon />
              </Badge>
            </IconButton>
          </Box>
        </Box>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className={styles.notificationDropdown}>
            <NotificationComponent userId={user?.id} userType="client" />
          </div>
        )}

        {/* Title and Description */}
        <Box className={styles.clientDContent}>
          <h1 className={styles.clientDTitle}>I Need</h1>
          <p className={styles.clientDDescription}>כל המומחים במקום אחד</p>
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
            onClick={handleNavigateToMain}
            sx={{ borderRadius: "14px", fontSize: "1.6rem" }}
          >
            פתח קריאה חדשה
          </Button>
          <Button
            variant="contained"
            className={`${styles.clientDButton} ${styles.clientDMyRequestsButton}`}
            onClick={handleNavigateToMyRequests}
            sx={{ borderRadius: "14px", fontSize: "1.6rem" }}
          >
            הקריאות שלי
          </Button>
          <Button
            variant="contained"
            className={`${styles.clientDButton} ${styles.clientDClosedRequestsButton}`}
            sx={{ borderRadius: "14px", fontSize: "1.6rem" }}
          >
            קריאות סגורות
          </Button>
        </Box>
      </Box>
    </NotificationProvider>
  );
};

export default Dashboard;
