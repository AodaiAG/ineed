import React, { useState, useEffect, useMemo } from "react";
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
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import api from "../../utils/clientApi";
import styles from "../../styles/client/Header.module.css";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../../components/LanguageSelectionPopup";
import NotificationComponent from "../../components/NotificationComponent";
import { useNotifications } from "../../contexts/NotificationContext";
import { useClientAuth } from '../../ClientProtectedRoute';
import fetchUnreadMessages from '../../utils/fetchUnreadMessages';

const ClientHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [chatAnchorEl, setChatAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [profileImage, setProfileImage] = useState("/images/dummy-profile.jpg");
  const [userName, setUserName] = useState("לקוח בדוי");
  const [unreadChats, setUnreadChats] = useState([]);

  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { user } = useClientAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNotificationClick = (event) => setNotificationAnchorEl(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchorEl(null);

  const handleChatClick = (event) => setChatAnchorEl(event.currentTarget);
  const handleChatClose = () => setChatAnchorEl(null);

  const handleProfileClick = (event) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const toggleLanguagePopup = () => setShowLanguagePopup((prev) => !prev);

  const handleNavigate = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const fetchClientInfo = async () => {
    try {
      const response = await api.get(`/api/client-info/${user.id}`);
      const data = response.data;
      setUserName(data.fullName || "לקוח ");
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  const fetchUnreadChats = async () => {
    if (!user?.id) return;

    try {
      const response = await api.get(`/api/my_requests?type=open`);
      const fetchedRequests = response.data?.data || [];

      if (!fetchedRequests.length) {
        setUnreadChats([]);
        return;
      }

      const requestIds = fetchedRequests.map(req => req.id);

      const unreadCounts = await fetchUnreadMessages(
        user.id,
        sessionStorage.getItem("clientChatToken"),
        requestIds
      );

      const unread = Object.entries(unreadCounts)
        .filter(([_, count]) => count > 0)
        .map(([id, count]) => ({ id, count }));

      setUnreadChats(unread);
    } catch (error) {
      console.error("Error fetching unread chats:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchClientInfo();
      fetchUnreadChats();

      const interval = setInterval(fetchUnreadChats, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const memoizedUnreadChats = useMemo(() => unreadChats, [unreadChats]);

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

        <IconButton className={styles.chatIcon} onClick={handleChatClick} sx={{ fontSize: '2.5rem' }}>
          <Badge badgeContent={memoizedUnreadChats.length} color="error">
            <ChatIcon sx={{ fontSize: '1.7rem' }} />
          </Badge>
        </IconButton>
      </Box>

      <Popover
        open={Boolean(chatAnchorEl)}
        anchorEl={chatAnchorEl}
        onClose={handleChatClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box className={styles.chatDropdown}>
        <Typography className={styles.chatDropdownHeader}>
            הודעות בצ'אט שלא נקראו 
          </Typography>

          {memoizedUnreadChats.length === 0 ? (
            <Typography className={styles.emptyChatMessage}>אין הודעות חדשות</Typography>
          ) : (
            memoizedUnreadChats.map(chat => (
              <Box key={chat.id} onClick={() => navigate(`/request?id=${chat.id}`)} className={styles.chatItem}>
                <Typography className={styles.chatText}>בקשה #{chat.id}</Typography>
                <span className={styles.chatCountBadge}>{chat.count}</span>
              </Box>
            ))
          )}
        </Box>
      </Popover>

      <Popover
        open={Boolean(notificationAnchorEl)}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          className: styles.customNotificationPopover,
        }}
      >
        <Box className={styles.notificationDropdown}>
          <NotificationComponent userId={user?.id} userType="client" />
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

      <IconButton className={styles.profileIcon} onClick={handleProfileClick}>
        <Avatar src={profileImage} sx={{ width: 40, height: 40, border: '4px solid #1A4B75 !important' }} />
      </IconButton>

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
    </Box>
  );
};

export default ClientHeader;
