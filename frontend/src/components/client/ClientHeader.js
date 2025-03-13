import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Badge,
  Avatar,
  Popover,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import styles from "../../styles/client/Header.module.css";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../../components/LanguageSelectionPopup";
import NotificationComponent from "../../components/NotificationComponent";
import { useNotifications } from "../../contexts/NotificationContext";
import { useClientAuth } from '../../ClientProtectedRoute';
import { API_URL } from '../../utils/constans';

const ClientHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [profileImage, setProfileImage] = useState("/images/dummy-profile.jpg");
  const [userName, setUserName] = useState("לקוח בדוי");

  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { user } = useClientAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const toggleLanguagePopup = () => setShowLanguagePopup((prev) => !prev);

  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const handleNavigate = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const fetchClientInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/client-info/${user.id}`);
      const data = response.data;
      setUserName(data.fullName || "לקוח ");
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchClientInfo();
    }
  }, [user?.id]);

  return (
    <Box className={styles.stickyHeader}>
      <Box className={styles.iconContainer}>
        <IconButton onClick={toggleSidebar} className={styles.menuIcon} sx={{ fontSize: '2.5rem' }}>
          <MenuIcon sx={{ fontSize: '2.0rem' }} />
        </IconButton>

        <IconButton className={styles.notificationIcon} onClick={handleNotificationClick} sx={{ fontSize: '2.5rem' }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActiveIcon sx={{ fontSize: '1.7rem' }} />
          </Badge>
        </IconButton>
      </Box>

      <Popover
        open={Boolean(notificationAnchorEl)}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          className: styles.customNotificationPopover,
        }}
        

      >
        <Box className={styles.notificationDropdown}>
          <NotificationComponent userId={user?.id} userType="client" />
        </Box>
      </Popover>

      <IconButton className={styles.profileIcon} onClick={handleProfileClick}>
        <Avatar 
          src={profileImage} 
          sx={{ 
            width: 40, 
            height: 40, 
            border: '4px solid #1A4B75 !important' 
          }} 
        />
      </IconButton>

      <Popover
        open={Boolean(profileAnchorEl)}
        anchorEl={profileAnchorEl}
        onClose={handleProfileClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box className={styles.profilePopover}>
          <Avatar src={profileImage} className={styles.profileAvatarLarge} />
          <Typography className={styles.profileName}>{userName}</Typography>

          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            className={styles.editButton}
          >
            ערוך תמונה
          </Button>

          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => navigate("/edit-settings")}
            className={styles.editButton}
          >
            ערוך הגדרות
          </Button>
        </Box>
      </Popover>

      <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar}>
        <Box className={styles.sidebarContainer} role="presentation">
          <List>
            <ListItem button onClick={() => handleNavigate("/dashboard")}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="בית" />
            </ListItem>

            <ListItem button onClick={() => handleNavigate("/main")}>
              <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
              <ListItemText primary="פתח קריאה חדשה" />
            </ListItem>

            <ListItem button onClick={toggleLanguagePopup}>
              <ListItemIcon><LanguageIcon /></ListItemIcon>
              <ListItemText primary="שפה" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {showLanguagePopup && (
        <div className={styles.languagePopup}>
          <LanguageSelector onClose={() => setShowLanguagePopup(false)} />
        </div>
      )}
    </Box>
  );
};

export default ClientHeader;
