import React, { useState } from 'react';
import { 
  List, ListItem, ListItemText, ListItemIcon, IconButton, Badge, Typography, 
  Paper, Box, Checkbox, Button, ButtonGroup, Slide 
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Edit mode icon
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import styles from '../styles/NotificationListComponent.module.css'; // ✅ Import CSS file


const getTranslation = (translation, key) => key.split('.').reduce((obj, k) => (obj || {})[k], translation);

const NotificationListComponent = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, deleteSelectedNotifications } = useNotifications();
  const { translation } = useLanguage();
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(false);
  const [selectedNotifs, setSelectedNotifs] = useState([]);

  const toggleEditMode = () => setEditMode(!editMode);

  const handleSelect = (id) => {
    setSelectedNotifs((prev) =>
      prev.includes(id) ? prev.filter((notifId) => notifId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifs.length === notifications.length) {
      setSelectedNotifs([]); // Deselect all
    } else {
      setSelectedNotifs(notifications.map((notif) => notif.id)); // Select all
    }
  };

  const handleMarkSelectedAsRead = async () => {
    await Promise.all(selectedNotifs.map((id) => markAsRead(id)));
    setSelectedNotifs([]); // Clear selection after marking as read
  };

  const handleDeleteSelected = async () => {
    await deleteSelectedNotifications(selectedNotifs);
    setSelectedNotifs([]); // Clear selection after deletion
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, padding: 2, position: 'relative' }}>
      {/* 🔹 Header with Title & Edit Button */}
              <Box className={styles.notificationHeader}>
          {/* ✅ Title (Header) */}
          <Typography variant="h6" className={styles.notificationTitle}>
            {translation.notifications.title || 'התראות'}
          </Typography>
          
          {/* ✅ 3-Dots Menu (MoreVertIcon) */}
          <IconButton onClick={toggleEditMode} className={styles.moreOptionsButton}>
            <MoreVertIcon />
          </IconButton>
        </Box>

{/* 🔹 Action Buttons (Only in Edit Mode) */}
{/* 🔹 Action Buttons (Only in Edit Mode) */}
<Slide direction="down" in={editMode} mountOnEnter unmountOnExit>
  <Box className={styles.actionButtonsContainer}> {/* ✅ Added a class for the container */}
    
    {/* ✅ "Select All" Button */}
    <Button size="small" onClick={handleSelectAll} variant="outlined" className={styles.selectAllButton}>
      {selectedNotifs.length === notifications.length ? 'בטל הכל' : 'בחר הכל'}
    </Button>

    {/* ✅ Action Buttons Group */}
    <ButtonGroup variant="contained" className={styles.actionButtonGroup}>
      <Button 
        onClick={handleMarkSelectedAsRead} 
        disabled={selectedNotifs.length === 0}
        className={styles.markReadButton}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5}} // ✅ Adds spacing

      >
        <DoneAllIcon /> סמן כנקרא
      </Button>
      <Button 
        onClick={handleDeleteSelected} 
        color="error" 
        disabled={selectedNotifs.length === 0}
        className={styles.deleteButton}
        sx={{ display: 'flex', alignItems: 'center' }} // ✅ Adds spacing

      >
        <DeleteIcon /> מחק
      </Button>
    </ButtonGroup>

  </Box>
</Slide>


      {/* 🔹 Notification List */}
      <List>
        {notifications.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            {translation.notifications.noNotifications || 'אין התראות זמינות.'}
          </Typography>
        ) : (
          notifications.map((notif) => (
            <ListItem
              key={notif.id}
              divider
              onClick={() => !editMode && navigate(notif.action)}
              style={{ cursor: editMode ? 'default' : 'pointer' }}
            >
              {editMode && (
                <Checkbox
                  checked={selectedNotifs.includes(notif.id)}
                  onChange={() => handleSelect(notif.id)}
                />
              )}
              <ListItemIcon>
                <Badge color="error" variant="dot" invisible={notif.isRead}>
                  <NotificationsActiveIcon color={notif.isRead ? 'action' : 'primary'} />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary={getTranslation(translation, notif.messageKey) || notif.message}
                secondary={new Date(notif.createdAt).toLocaleString()}
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default NotificationListComponent;
