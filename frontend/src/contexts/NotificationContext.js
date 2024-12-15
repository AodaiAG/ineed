import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { API_URL } from '../utils/constans';
import { useLanguage } from '../contexts/LanguageContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children, userId, userType }) => {
  const [notifications, setNotifications] = useState([]);
  const { translation } = useLanguage(); // Get translations

  // Utility function to resolve the message from messageKey
  const getTranslatedMessage = (messageKey) => {
    return messageKey.split('.').reduce((obj, key) => obj?.[key], translation) || messageKey;
  };

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle toast click to mark notification as read and close the toast
  const handleToastClick = (notif) => {
    markAsRead(notif.id);
    toast.dismiss(); // Close the toast immediately
  };

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications/${userType}/${userId}`);
      if (response.data.success) {
        const newNotifications = response.data.data;

        // Show toast notifications for unread items
        newNotifications.forEach((notif) => {
          if (!notif.isRead) {
            const translatedMessage = getTranslatedMessage(notif.messageKey);
            console.log('Triggering toast for notification:', translatedMessage);
            toast.info(translatedMessage, {
              onClick: () => handleToastClick(notif),
            });
          }
        });

        setNotifications(newNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (userId && userType) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      console.log('NotificationProvider: userId or userType missing');
    }
  }, [userId, userType]);

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, fetchNotifications }}>
      {children}
      <ToastContainer position="top-right" autoClose={5000} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
