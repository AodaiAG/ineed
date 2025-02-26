import React, { useState, useEffect } from "react";
import { Button, ButtonBase, Box, IconButton, Badge, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import LanguageIcon from "@mui/icons-material/Language";
import styles from "../../styles/client/Dashboard.module.css";
import useClientAuthCheck from "../../hooks/useClientAuthCheck";
import { useLanguage } from "../../contexts/LanguageContext";
import NotificationComponent from "../../components/NotificationComponent";
import { NotificationProvider } from "../../contexts/NotificationContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false); // State to handle popup visibility
  const [showNotifications, setShowNotifications] = useState(false); // State to toggle notifications
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
  const { translation } = useLanguage();
  const { isAuthenticated, loading, user } = useClientAuthCheck();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleNavigateToMyRequests = () => {
    navigate("/dashboard/my-requests");
  };
  const handleNavigateToClosedRequests = () => {
    navigate("/dashboard/closed-requests");
  };

  const handleNavigateToMain = () => {
    navigate("/main");
  };

  const handleSettingsClick = () => {
    navigate("/client/edit-settings");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (loading || !translation) {
    return (
      <div className={styles["  inner-overlay"]}>
        <div className={styles["spinner"]}></div>
      </div>
    );
  }

  return (
    <NotificationProvider userId={user?.id} userType="client">
      <Box className={styles.clientDContainer}>
        {/* Header */}
        <Box className={styles.clientDHeader}>
          <Box className={styles.iconContainer}>
            {/* Hamburger Menu Icon */}
            <IconButton onClick={toggleSidebar} className={styles.menuIcon}>
              <MenuIcon />
            </IconButton>

            {/* Notification Icon */}
            <IconButton className={styles.notificationIcon} onClick={handleNotificationClick}>
              <Badge color="error" variant="dot">
                <NotificationsActiveIcon />
              </Badge>
            </IconButton>
          </Box>
        </Box>

        {/* Sidebar */}
        <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar}>
          <Box className={styles.sidebarContainer} role="presentation" onClick={toggleSidebar}>
            <List>
             

              <ListItem button onClick={() => setShowPopup(true)}>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
                <ListItemText primary="Language" />
              </ListItem>

              <ListItem button onClick={handleNotificationClick}>
                <ListItemIcon>
                  <NotificationsActiveIcon />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

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

        <div className={styles.spacer}></div>


        {/* Buttons */}
        <Box className={styles.clientDButtonsContainer}>

        <Box className={styles.clientDImageContainer}>
          <img
            src="/images/Prof/worker2.png"
            alt="Worker"
            className={styles.clientDWorkerImage}
          />
        </Box>
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
            onClick={handleNavigateToClosedRequests}
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
