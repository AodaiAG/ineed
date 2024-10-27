import React, { useState, useEffect } from 'react';
import styles from '../../styles/ExpertInterface.module.css';
import { useNavigate } from 'react-router-dom';
import LanguageSelectionPopup from '../../components/LanguageSelectionPopup';
import { sendSms ,shortenUrl} from '../../utils/generalUtils';

import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';

function ExpertInterface() {
    const navigate = useNavigate();
    const { translation } = useLanguage();
    const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
    const [sendDisabled, setSendDisabled] = useState(false);
    const [countdown, setCountdown] = useState('');

    const startCountdown = (remainingTime) => {
        const endTime = Date.now() + remainingTime;
        const interval = setInterval(() => {
            const timeLeft = endTime - Date.now();
            if (timeLeft <= 0) {
                clearInterval(interval);
                setSendDisabled(false);
                setCountdown('');
                sessionStorage.removeItem('lastSentTime');
            } else {
                const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                setCountdown(`${hours}:${minutes}:${seconds}`);
            }
        }, 1000);
    };
    useEffect(() => {
        document.body.classList.add(styles.expertInterface_body);

        // Check if button is already disabled from previous session
        const lastSentTime = sessionStorage.getItem('lastSentTime');
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
    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    // Countdown function


    // Toggle the language selection popup
    const handleLanguageIconClick = () => {
        setIsLanguagePopupOpen((prev) => !prev);
    };

    const handleMySettingsClick = () => {
        const id = sessionStorage.getItem('professionalId');
        if (id) {
            navigate('/pro/edit-settings');
        } else {
            alert(translation.errorOccurredMessage);
        }
    };

    // Resend business card link
    const handleResendClick = async () => {
        const id = sessionStorage.getItem('professionalId');
        if (!id) return alert(translation.errorOccurredMessage);

        setSendDisabled(true);
        sessionStorage.setItem('lastSentTime', Date.now());
        startCountdown(24 * 60 * 60 * 1000);

        const businessCardLink = `https://ineed.vercel.app/pro/bs-card?id=${id}`;
        const shortenedLink = await shortenUrl(businessCardLink);
        const message = translation.businessCardSMS.replace("{link}", shortenedLink);
        sendSms(sessionStorage.getItem('professionalPhoneNumber'), message);
    };

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
