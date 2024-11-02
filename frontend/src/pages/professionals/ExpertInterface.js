import React, { useState, useEffect } from 'react';
import styles from '../../styles/ExpertInterface.module.css';
import { useNavigate } from 'react-router-dom';
import LanguageSelectionPopup from '../../components/LanguageSelectionPopup';
import { sendSms, shortenUrl } from '../../utils/generalUtils';
import { useLanguage } from '../../contexts/LanguageContext';
import useUserValidation from '../../hooks/useUserValidation';

function ExpertInterface() {
    const navigate = useNavigate();
    // Use the hook and pass desired routes for valid and invalid cases
    const { isValidUserdata, decryptedUserdata } = useUserValidation(null, '/pro/enter'); 
    const { translation } = useLanguage();
    const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
    const [sendDisabled, setSendDisabled] = useState(false);
    const [countdown, setCountdown] = useState('');

    // Initialize styles and manage countdown if needed
    useEffect(() => {
        window.scrollTo(0, 0);

        // Since the component renders only if `isValidUserdata` is true, we know it's valid here
        document.body.classList.add(styles.expertInterface_body);

        // Check if button is already disabled from previous session
        const lastSentTime = localStorage.getItem('lastSentTime');
        if (lastSentTime) {
            const timeDiff = 24 * 60 * 60 * 1000 - (Date.now() - lastSentTime);
            if (timeDiff > 0) {
                setSendDisabled(true);
                startCountdown(timeDiff);
            }
        }

        return () => {
            document.body.classList.remove(styles.expertInterface_body);
        };
    }, []);

    // Countdown timer function
    const startCountdown = (remainingTime) => {
        const endTime = Date.now() + remainingTime;
        const interval = setInterval(() => {
            const timeLeft = endTime - Date.now();
            if (timeLeft <= 0) {
                clearInterval(interval);
                setSendDisabled(false);
                setCountdown('');
                localStorage.removeItem('lastSentTime');
            } else {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                setCountdown(`${hours}:${minutes}:${seconds}`);
            }
        }, 1000);
    };

    // Render loading screen while user data is being checked
    if (isValidUserdata === null) {
        return <div>Loading...</div>;
    }

    // Toggle the language selection popup
    const handleLanguageIconClick = () => {
        setIsLanguagePopupOpen((prev) => !prev);
    };

    // Navigate to settings page
    const handleMySettingsClick = () => {
        navigate('/pro/edit-settings');
    };

    // Resend business card link
    const handleResendClick = async () => {
        try {
            if (!decryptedUserdata) {
                return alert(translation.errorOccurredMessage);
            }

            const id = decryptedUserdata.profId;
            if (!id) return alert(translation.errorOccurredMessage);

            setSendDisabled(true);
            localStorage.setItem('lastSentTime', Date.now());
            startCountdown(24 * 60 * 60 * 1000);

            const businessCardLink = `https://ineed.vercel.app/pro/bs-card?id=${id}`;
            const shortenedLink = await shortenUrl(businessCardLink);
            const message = translation.businessCardSMS.replace("{link}", shortenedLink);
            sendSms(decryptedUserdata.phoneNumber, message);
        } catch (e) {
            console.error('Error decrypting or handling business card data:', e);
        }
    };

    if (!translation) {
        return <div>Loading translations...</div>; // Wait for translations to load
    }

    return (
        <div className={styles.expertInterface_container}>
            {/* Language Switch Component */}
            <div className={styles.expertInterface_languageSwitch} onClick={handleLanguageIconClick}>
                <img src="/images/Prof/language-icon.png" alt={translation.languageIconAlt} />
            </div>

            {/* Language Selection Popup */}
            {isLanguagePopupOpen && <LanguageSelectionPopup onClose={() => setIsLanguagePopupOpen(false)} />}

            {/* Title */}
            <h1 className={styles.expertInterface_mainTitle}>I Need</h1>
            <h2 className={styles.expertInterface_subTitle}>{translation.expertInterfaceTitle}</h2>

            {/* Image Section */}
            <div className={styles.expertInterface_imageContainer}>
                <img src="/images/Prof/worker2.png" alt={translation.workerImageAlt} className={styles.expertInterface_workerImage} />
            </div>

            {/* Message Section */}
            <p className={styles.expertInterface_messageText}>{translation.businessCardMessage}</p>

            {/* Buttons */}
            <button className={styles.expertInterface_settingsButton} onClick={handleMySettingsClick}>
                {translation.mySettingsButtonLabel}
            </button>
            <button
                className={`${styles.expertInterface_settingsButton} ${styles.resendButton}`}
                onClick={handleResendClick}
                disabled={sendDisabled}
            >
                {sendDisabled && <span className={styles.countdown}>{countdown}</span>}
                {translation.resendBusinessCardButtonLabel}
            </button>
        </div>
    );
}

export default ExpertInterface;
