import React, { useState, useEffect,useContext } from 'react';
import styles from '../../styles/ExpertInterface.module.css';
import { useNavigate } from 'react-router-dom';
import LanguageSelectionPopup from '../../components/LanguageSelectionPopup';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';  // Import useAuth hook
import useAuthCheck from '../../hooks/useAuthCheck';


function ExpertInterface() {
    const navigate = useNavigate();
    const { translation } = useLanguage();
    const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
    const [sendDisabled, setSendDisabled] = useState(false);
    const { isAuthenticated, loading ,user} = useAuthCheck();

    useEffect(() => {
        if (!loading && !isAuthenticated)
             {
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
     // Optional: Show a loading indicator while verifying
   
     
     
    // Function to open WhatsApp with a predefined message
    const handleWhatsAppClick = () => {
        const phoneNumber = '0504564232';
        const internationalPhoneNumber = `+972${phoneNumber}`;
        const message = encodeURIComponent(translation.customerSupportMessage || "Hello, I'm reaching out regarding your services.");
        window.location.href = `https://wa.me/${internationalPhoneNumber}?text=${message}`;
    };

    // Toggle the language selection popup
    const handleLanguageIconClick = () => {
        setIsLanguagePopupOpen((prev) => !prev);
    };

    // Navigate to settings page
    const handleMySettingsClick = () => {
        navigate('/pro/edit-settings');
    };

    // Redirect to the business card page
    const handleBusinessCardClick = () => {
        const id = user.profId;
        if (!id) {
            alert(translation.errorOccurredMessage);
            return;
        }
        // Navigate to the business card page with the professional's ID
        navigate(`/pro/bs-card?id=${id}`);
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
            {/* Header Container for Language Switch, Title, and Subtitle */}
            <div className={styles.headerContainer}>
                <div className={styles.expertInterface_languageSwitch} onClick={handleLanguageIconClick}>
                    <img src="/images/Prof/language-icon.png" alt={translation.languageIconAlt} />
                </div>
                <div className={styles.titleContainer}>
                    <h1 className={styles.expertInterface_mainTitle}>I Need</h1>
                    <h2 className={styles.expertInterface_subTitle}>{translation.expertInterfaceTitle}</h2>
                </div>
            </div>
    
            {/* Language Selection Popup */}
            {isLanguagePopupOpen && <LanguageSelectionPopup onClose={() => setIsLanguagePopupOpen(false)} />}
            
            <div className={styles.spacer}></div>
            
            {/* Image Section */}
            <div className={styles.expertInterface_imageContainer}>
                <img src="/images/Prof/worker2.png" alt={translation.workerImageAlt} className={styles.expertInterface_workerImage} />
                {/* New Text Under Worker Image with clickable "כאן" */}
                <p className={styles.expertInterface_contactPrompt}>
                    {translation.inquiryMessage}
                    <span className={styles.clickableText} onClick={handleWhatsAppClick}> {translation.clickHere}</span>
                </p>
            </div>
    
            <div className={styles.spacer}></div>
            
            {/* Business Card Button */}
            <div className={styles.footerContainer}>
                <button
                    className={styles.expertInterface_businessCardButton}
                    onClick={handleBusinessCardClick}
                    disabled={sendDisabled}
                >
                        {translation.myBusinessCard}

                </button>
                
                {/* Settings Button */}
                <button
                    className={styles.expertInterface_settingsButton}
                    onClick={handleMySettingsClick}
                >
                    {translation.mySettingsButtonLabel}
                </button>
            </div>
        </div>
    );
}

export default ExpertInterface;
