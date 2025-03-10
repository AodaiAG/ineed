import React, { createContext, useContext, useState, useEffect, useRef,useMemo } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { API_URL } from '../utils/constans';
import { useLanguage } from '../contexts/LanguageContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children, userId, userType }) => {
  const [notifications, setNotifications] = useState([]);
  const { translation } = useLanguage();
  const hasFetched = useRef(false); // ✅ Prevents multiple fetches

  // ✅ Use Local Storage to track shown toasts
  const getShownToastIds = () => {
    return new Set(JSON.parse(localStorage.getItem('shownToastIds') || '[]'));
  };

  const setShownToastIds = (ids) => {
    localStorage.setItem('shownToastIds', JSON.stringify([...ids]));
  };

  const getTranslatedMessage = (messageKey) => {
    return messageKey.split('.').reduce((obj, key) => obj?.[key], translation) || messageKey;
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleToastClick = (notif) => {
    console.log("🔔 Toast clicked for notification:", notif);
  
    if (!notif) {
      console.error("❌ handleToastClick received an undefined notification.");
      return;
    }
  
    markAsRead(notif.id);
  
    if (typeof toast.dismiss !== "function") {
      console.error("❌ toast.dismiss is not a function!");
    } else {
      toast.dismiss();
    }
  };
  

  const fetchNotifications = async () => {
    if (hasFetched.current) return; // ✅ Prevents multiple API calls
    hasFetched.current = true;


    try {
      const response = await axios.get(`${API_URL}/notifications/${userType}/${userId}`);

      if (response.data.success) {
        const newNotifications = response.data.data;

        let toastCount = 0;
        let shownToastIds = getShownToastIds(); // ✅ Fetch from Local Storage

        newNotifications.forEach((notif) => {
          if (!notif.isRead && !shownToastIds.has(notif.id)) {
            const translatedMessage = getTranslatedMessage(notif.messageKey);

            toast.info(translatedMessage, {
              onClick: () => handleToastClick(notif),
            });

            shownToastIds.add(notif.id); // ✅ Add toast to local storage
            toastCount++;
          }
        });

        setShownToastIds(shownToastIds); // ✅ Persist updated toast list
        setNotifications(newNotifications);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
    } finally {
      setTimeout(() => {
        hasFetched.current = false; // ✅ Reset after delay
      }, 1000);
    }
  };

  useEffect(() => {
    if (userId && userType) {
      fetchNotifications(); // ✅ Fetch on mount
      const interval = setInterval(() => {
        hasFetched.current = false; // ✅ Allow new fetch every 30s
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    } else {
      console.log('⚠️ NotificationProvider: userId or userType missing');
    }
  }, [userId, userType]);

  const unreadCount = useMemo(() => {
    return notifications.filter((notif) => !notif.isRead).length;
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount,setNotifications, markAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
