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
  TextField,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import styles from "../../styles/Header.module.css";
import { useNavigate } from "react-router-dom";
import LanguageSelectionPopup from "../../components/LanguageSelectionPopup";
import NotificationComponent from "../../components/NotificationComponent";
import { useNotifications } from "../../contexts/NotificationContext";
import { useProfessionalAuth } from '../../ProfessionalProtectedRoute';
import { API_URL } from '../../utils/constans';

const ProfessionalHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [profileImage, setProfileImage] = useState("/images/dummy-profile.jpg");
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("מומחה בדוי");
  const [newName, setNewName] = useState("");

  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { user } = useProfessionalAuth();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const toggleLanguagePopup = () => setShowLanguagePopup(prev => !prev);

  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
    setIsEditing(false);
  };

  const fetchProfessional = async () => {
    try {
      const response = await axios.get(`${API_URL}/professionals/prof-info/${user.profId}`);
      const data = response.data;
      setUserName(`${data.fname} ${data.lname}`);
      setProfileImage(data.image || "/images/dummy-profile.jpg");
    } catch (error) {
      console.error("Error fetching professional data:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await axios.post(`${API_URL}/professionals/upload-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const serverImageUrl = response.data.imageUrl;
        setProfileImage(serverImageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleNameEdit = () => {
    if (newName.trim()) {
      setUserName(newName);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    console.log("User logged out!");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (user?.profId) {
      fetchProfessional();
    }
  }, [user?.profId]);

  return (
    <Box className={styles.stickyHeader}>
      <Box className={styles.iconContainer}>
        <IconButton onClick={toggleSidebar} className={styles.menuIcon}>
          <MenuIcon sx={{ fontSize: '2rem' }} />
        </IconButton>

        <IconButton className={styles.notificationIcon} onClick={handleNotificationClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActiveIcon sx={{ fontSize: '1.7rem' }} />
          </Badge>
        </IconButton>
      </Box>

      <IconButton className={styles.profileIcon} onClick={handleProfileClick}>
        <Avatar src={profileImage} sx={{ width: 40, height: 40 ,border: '4px solid #1A4B75 !important',
}} />
      </IconButton>

      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      >
        <Box className={styles.sidebarContainer} role="presentation">
          <List>
            <ListItem button onClick={() => handleNavigate("/pro/expert-interface")}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary=" בית" />
            </ListItem>

            <ListItem button onClick={() => handleNavigate("/pro/edit-settings")}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="הגדרות" />
            </ListItem>

            <ListItem button onClick={toggleLanguagePopup}>
              <ListItemIcon><LanguageIcon /></ListItemIcon>
              <ListItemText primary="שפה" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

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
          <NotificationComponent userId={user?.profId} userType="professional" />
        </Box>
      </Popover>

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
  {/* Profile Image */}
  <Avatar src={profileImage} className={styles.profileAvatarLarge} />

  {/* Professional Name */}
  <Typography className={styles.profileName} sx={{ color: '#FDBE00', fontSize: '1.5rem', fontWeight: 'bold' }}>
    {userName}
  </Typography>

  {/* Edit Picture */}
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    style={{ display: "none" }}
    id="upload-profile"
  />
  <label htmlFor="upload-profile">
    <Button component="span" startIcon={<EditIcon />} variant="outlined" className={styles.editButton}>
      ערוך תמונה
    </Button>
  </label>

  {/* Navigate to Edit Settings with Icon */}
  <Button
    variant="outlined"
    startIcon={<SettingsIcon />}
    className={styles.editButton}
    onClick={() => navigate("/pro/edit-settings")}
  >
    ערוך הגדרות
  </Button>
</Box>


      </Popover>
    </Box>
  );
};

export default ProfessionalHeader;
