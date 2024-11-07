import React, { useState, useEffect } from 'react';
import styles from '../../styles/ExpertInterface.module.css';
import { useNavigate } from 'react-router-dom';
import LanguageSelectionPopup from '../../components/LanguageSelectionPopup';
import { sendSms, shortenUrl } from '../../utils/generalUtils';
import { useLanguage } from '../../contexts/LanguageContext';
import useUserValidation from '../../hooks/useUserValidation';

function ExpertInterface() {
    const navigate = useNavigate();
    const { isValidUserdata, decryptedUserdata } = useUserValidation(null, '/pro/enter'); 
    const { translation } = useLanguage();
    const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
    const [sendDisabled, setSendDisabled] = useState(false);
    const [countdown, setCountdown] = useState('');

    // Initialize styles and manage countdown if needed
    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.classList.add(styles.expertInterface_body);

        // Check if button is already disabled from previous session
        const lastSentTime = localStorage.getItem('lastSentTime');
        if (lastSentTime) {
            const timeDiff = 12 * 60 * 60 * 1000 - (Date.now() - lastSentTime); // 12-hour countdown
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
                const hours = String(Math.floor(timeLeft / (1000 * 60 * 60))).padStart(2, '0');
                const minutes = String(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
                setCountdown(`${hours}:${minutes}`);
            }
        }, 1000);
    };

    // Function to open WhatsApp with a predefined message
    const handleWhatsAppClick = () => {
        const phoneNumber = '0504564232';
        const internationalPhoneNumber = `+972${phoneNumber}`;
        const message = encodeURIComponent(translation.customerSupportMessage || "Hello, I'm reaching out regarding your services.");
        window.location.href = `https://wa.me/${internationalPhoneNumber}?text=${message}`;
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
            startCountdown(12 * 60 * 60 * 1000); // 12-hour countdown

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
                {/* New Text Under Worker Image with clickable "כאן" */}
                <p className={styles.expertInterface_contactPrompt}>
                    לפניה או הצעה לחץ 
                    <span className={styles.clickableText} onClick={handleWhatsAppClick}> כאן</span>
                </p>
            </div>

            {/* New Card Resend Section */}
             <div className={styles.expertInterface_resendSection}>
                <span className={styles.cardRequestText}>
                    {translation.resendBusinessCardText || "שלח לי את הכרטיס שוב"}
                </span>
                <span
                    className={sendDisabled ? styles.disabledLink : styles.resendLink}
                    onClick={!sendDisabled ? handleResendClick : null}
                >
                    {sendDisabled ? countdown : translation.clickHereText || "כאן"}
                </span>
            </div>


            {/* Settings Button at the Bottom */}
            <button className={styles.expertInterface_settingsButton} onClick={handleMySettingsClick}>
                {translation.mySettingsButtonLabel}
            </button>
        </div>
    );
}

export default ExpertInterface;
