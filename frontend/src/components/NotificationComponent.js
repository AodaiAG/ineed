import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, IconButton, Badge, Typography, Paper } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

// Utility function to get nested translation keys
const getTranslation = (translation, key) => {
  return key.split('.').reduce((obj, k) => (obj || {})[k], translation);
};

const NotificationListComponent = () => {
  const { notifications, markAsRead } = useNotifications();
  const { translation } = useLanguage();
  const navigate = useNavigate();

  // Handle notification actions and mark as read
  const handleNotificationAction = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    if (notif.action) {
      navigate(notif.action); // Navigate to the specified action URL
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, margin: '20px auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        {translation.notifications.title || 'Notifications'}
      </Typography>
      <List>
        {notifications.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            {translation.notifications.noNotifications || 'No notifications available.'}
          </Typography>
        ) : (
          notifications.map((notif) => (
            <ListItem
              key={notif.id}
              divider
              onClick={() => handleNotificationAction(notif)}
              style={{ cursor: 'pointer' }}
            >
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
