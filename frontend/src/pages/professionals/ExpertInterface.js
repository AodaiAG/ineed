import React, { useState, useEffect } from 'react';
import styles from '../../styles/ExpertInterface.module.css';
import { useNavigate } from 'react-router-dom';
import LanguageSelectionPopup from '../../components/LanguageSelectionPopup';
import { useLanguage } from '../../contexts/LanguageContext';
import { IconButton, Badge, Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import useAuthCheck from '../../hooks/useAuthCheck';
import NotificationComponent from '../../components/NotificationComponent';
import { NotificationProvider } from "../../contexts/NotificationContext";

function ExpertInterface() {
    const navigate = useNavigate();
    const { translation } = useLanguage();
    const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
    const { isAuthenticated, loading, user } = useAuthCheck();
    const [showNotifications, setShowNotifications] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/pro/enter'); // Redirect to login if not authenticated
        }
    }, [loading, isAuthenticated, navigate]);

    // Initialize styles
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.classList.add(styles.expertInterface_body);

        return () => {
            document.body.classList.remove(styles.expertInterface_body);
        };
    }, []);

    const handleLanguageIconClick = () => {
        setIsLanguagePopupOpen((prev) => !prev);
    };

    const handleNavigateToRequests = (path) => {
        navigate(`/pro/requests/${path}`);
    };

    const handleSettingsClick = () => {
        navigate('/pro/edit-settings');
    };

    const handleNotificationClick = () => {
        setShowNotifications((prev) => !prev);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    if (loading || !translation) {
        return (
            <div className={styles['spinner-overlay']}>
                <div className={styles['spinner']}></div>
            </div>
        );
    }

    return (
        <NotificationProvider userId={user?.profId} userType="professional">
            <div className={styles.expertInterface_container}>
                {/* Header Container */}
                <div className={styles.headerContainer}>
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

                    <div className={styles.titleContainer}>
                        <h1 className={styles.expertInterface_mainTitle}>I Need</h1>
                        <h2 className={styles.expertInterface_subTitle}>{translation.expertInterfaceTitle}</h2>
                    </div>
                </div>

                {/* Sidebar */}
                <Drawer
  anchor="left"
  open={isSidebarOpen}
  onClose={toggleSidebar}
  container={window.innerWidth >= 1025 ? document.getElementById("drawer-container") : undefined} // ✅ Only set container on large screens
  PaperProps={{
    style: { position: window.innerWidth >= 1025 ? "absolute" : "fixed" }, // ✅ Keep normal behavior on mobile
  }}
  BackdropProps={{
    style: { position: window.innerWidth >= 1025 ? "absolute" : "fixed" },
  }}
  ModalProps={{
    container: window.innerWidth >= 1025 ? document.getElementById("drawer-container") : undefined,
    style: { position: window.innerWidth >= 1025 ? "absolute" : "fixed" },
  }}
>
                    <Box className={styles.sidebarContainer} role="presentation" onClick={toggleSidebar}>
                        <List>
                            <ListItem button onClick={handleSettingsClick}>
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="הגדרות" />
                            </ListItem>

                            <ListItem button onClick={handleLanguageIconClick}>
                                <ListItemIcon>
                                    <LanguageIcon />
                                </ListItemIcon>
                                <ListItemText primary="שפה" />
                            </ListItem>

                            <ListItem button onClick={handleNotificationClick}>
                                <ListItemIcon>
                                    <NotificationsActiveIcon />
                                </ListItemIcon>
                                <ListItemText primary="התראות" />
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>

                {/* Notification Dropdown */}
                {showNotifications && (
                    <div className={styles.notificationDropdown}>
                        <NotificationComponent userId={user?.id} userType="professional" />
                    </div>
                )}

                {/* Language Selection Popup */}
                {isLanguagePopupOpen && (
                    <LanguageSelectionPopup onClose={() => setIsLanguagePopupOpen(false)} backgroundColor="black" />
                )}


                {/* Image Section */}


                <div className={styles.spacer}></div>

                {/* Request Buttons */}
                <div className={styles.footerContainer}>

                <div className={styles.expertInterface_imageContainer}>
                    <img
                        src="/images/Prof/worker2.png"
                        alt={translation.workerImageAlt}
                        className={styles.expertInterface_workerImage}
                    />

                </div>
                    <button className={styles.expertInterface_businessCardButton} onClick={() => handleNavigateToRequests('new')}>
                        קריאות חדשות
                    </button>
                    <button className={styles.expertInterface_businessCardButton} onClick={() => handleNavigateToRequests('in-process')}>
                        קריאות בתהליך
                    </button>
                    <button className={styles.expertInterface_businessCardButton} onClick={() => handleNavigateToRequests('mine')}>
                        הקריאות שלי
                    </button>
                     <button   
                    className={`${styles.expertInterface_businessCardButton} ${styles.closedRequestsButton}`}
                     onClick={() => handleNavigateToRequests('closed')}>
                        קריאות סגורות
                    </button>
                </div>
            </div>
        </NotificationProvider>
    );
}

export default ExpertInterface;
