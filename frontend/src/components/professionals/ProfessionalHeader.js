import React, { useState } from "react";
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
import styles from "../../styles/Header.module.css";
import { useNavigate } from "react-router-dom";
import LanguageSelectionPopup from "../../components/LanguageSelectionPopup";
import NotificationComponent from "../../components/NotificationComponent";
import { useNotifications } from "../../contexts/NotificationContext";
import { useProfessionalAuth } from '../../ProfessionalProtectedRoute';

const ProfessionalHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImage, setProfileImage] = useState("/images/dummy-profile.jpg");
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("מומחה בדוי");
  const [newName, setNewName] = useState("");

  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { user } = useProfessionalAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    setIsSidebarOpen(false);
  };

  const toggleLanguagePopup = () => {
    setShowLanguagePopup((prev) => !prev);
    setIsSidebarOpen(false);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
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

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <Box className={styles.stickyHeader}>
      <Box className={styles.iconContainer}>
        <IconButton onClick={toggleSidebar} className={styles.menuIcon}>
          <MenuIcon />
        </IconButton>

        <IconButton className={styles.notificationIcon} onClick={handleNotificationClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActiveIcon />
          </Badge>
        </IconButton>
      </Box>

      <IconButton className={styles.profileIcon} onClick={handleProfileClick}>
        <AccountCircleIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        PaperProps={{
          style: { position: "fixed" },
        }}
      >
        <Box
          className={styles.sidebarContainer}
          role="presentation"
          onClick={toggleSidebar}
        >
          <List>
            <ListItem button onClick={() => handleNavigate("/pro/dashboard")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="דף הבית" />
            </ListItem>

            <ListItem button onClick={() => handleNavigate("/pro/edit-settings")}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="הגדרות" />
            </ListItem>

            <ListItem button onClick={toggleLanguagePopup}>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="שפה" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
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

          {!isEditing ? (
            <>
              <Typography className={styles.profileName}>{userName}</Typography>
              <Button onClick={() => setIsEditing(true)} variant="outlined" className={styles.editButton}>
                ערוך שם
              </Button>
            </>
          ) : (
            <>
              <TextField
                size="small"
                variant="outlined"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="הכנס שם חדש"
                className={styles.editInput}
              />
              <Button onClick={handleNameEdit} variant="contained" className={styles.saveButton}>
                שמור
              </Button>
            </>
          )}

          <Button onClick={handleLogout} startIcon={<LogoutIcon />} variant="contained" color="error">
            התנתק
          </Button>
        </Box>
      </Popover>

      {showNotifications && (
        <div className={styles.notificationDropdown}>
          <NotificationComponent userId={user?.id} userType="professional" />
        </div>
      )}

      {showLanguagePopup && (
        <div className={styles.languagePopup}>
          <LanguageSelectionPopup onClose={() => setShowLanguagePopup(false)} />
        </div>
      )}
    </Box>
  );
};

export default ProfessionalHeader;
