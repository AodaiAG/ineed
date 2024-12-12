import React, { useState, useEffect } from 'react';
import styles from '../../styles/ExpertInterface.module.css';
import { useNavigate } from 'react-router-dom';
import LanguageSelectionPopup from '../../components/LanguageSelectionPopup';
import { useLanguage } from '../../contexts/LanguageContext';
import { IconButton, Badge, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useAuthCheck from '../../hooks/useAuthCheck';
import NotificationComponent from '../../components/NotificationComponent'; // Import the NotificationComponent
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { FaBell } from 'react-icons/fa';


function ExpertInterface() {
    const navigate = useNavigate();
    const { translation } = useLanguage();
    const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
    const { isAuthenticated, loading, user } = useAuthCheck();
    const [showNotifications, setShowNotifications] = useState(false);

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

    if (loading || !translation) {
        return (
            <div className={styles['spinner-overlay']}>
                <div className={styles['spinner']}></div>
            </div>
        );
    }

    return (
        <div className={styles.expertInterface_container}>
            {/* Header Container */}
            <div className={styles.headerContainer}>
                <Box className={styles.iconContainer}>
                    {/* Language Icon */}
                    <div className={styles.expertInterface_languageSwitch} onClick={handleLanguageIconClick}>
                        <img src="/images/Prof/language-icon.png" alt={translation.languageIconAlt} />
                    </div>

                    {/* Notification Icon */}
                    <IconButton
    className={styles.notificationIcon}
    onClick={handleNotificationClick}
>
    <Badge color="error" variant="dot">
        <NotificationsActiveIcon />
    </Badge>
</IconButton>

                    {/* Settings Icon */}
                    <IconButton
                        className={styles.settingsIcon}
                        onClick={handleSettingsClick}
                        style={{ position: 'absolute', top: '10px', left: '20px' }}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Box>

                <div className={styles.titleContainer}>
                    <h1 className={styles.expertInterface_mainTitle}>I Need</h1>
                    <h2 className={styles.expertInterface_subTitle}>{translation.expertInterfaceTitle}</h2>
                </div>
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className={styles.notificationDropdown}>
                    <NotificationComponent userId={user?.id} userType="professional" />
                </div>
            )}

            {/* Language Selection Popup */}
            {isLanguagePopupOpen && (
                <LanguageSelectionPopup
                    onClose={() => setIsLanguagePopupOpen(false)}
                    backgroundColor="black"
                />
            )}

            <div className={styles.spacer}></div>

            {/* Image Section */}
            <div className={styles.expertInterface_imageContainer}>
                <img
                    src="/images/Prof/worker2.png"
                    alt={translation.workerImageAlt}
                    className={styles.expertInterface_workerImage}
                />
                <p className={styles.expertInterface_contactPrompt}>
                    {translation.inquiryMessage}
                    <span className={styles.clickableText} onClick={() => navigate('/pro/contact')}>
                        {translation.clickHere}
                    </span>
                </p>
            </div>

            <div className={styles.spacer}></div>

            {/* Request Buttons */}
            <div className={styles.footerContainer}>
                <button
                    className={styles.expertInterface_businessCardButton}
                    onClick={() => handleNavigateToRequests('new')}
                >
                    קריאות חדשות
                </button>
                <button
                    className={styles.expertInterface_businessCardButton}
                    onClick={() => handleNavigateToRequests('in-process')}
                >
                    קריאות בתהליך
                </button>
                <button
                    className={styles.expertInterface_businessCardButton}
                    onClick={() => handleNavigateToRequests('mine')}
                >
                    הקריאות שלי
                </button>
                <button
                    className={styles.expertInterface_businessCardButton}
                    onClick={() => handleNavigateToRequests('closed')}
                >
                    קריאות סגורות
                </button>
            </div>
        </div>
    );
}

export default ExpertInterface;
