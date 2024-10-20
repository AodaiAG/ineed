import React, { useState } from 'react';
import styles from '../../styles/ExpertInterface.module.css';
import { useNavigate } from 'react-router-dom';
import LanguageSelectionPopup from '../../components/LanguageSelectionPopup';
import { useLanguage } from '../../contexts/LanguageContext';

function ExpertInterface() {
    const navigate = useNavigate();
    const { translation } = useLanguage();
    const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    // Toggle the language selection popup
    const handleLanguageIconClick = () => {
        setIsLanguagePopupOpen((prev) => !prev);
    };

    const handleMySettingsClick = () => {
        const id = sessionStorage.getItem('professionalId');
        if (id) {
            // Navigate to the settings page with the user's ID as a query parameter
            sessionStorage.setItem('professionalId', response.data.id);
            navigate('/pro/edit-settings');
        } else {
            alert(translation.errorOccurredMessage);
        }
    };

    return (
        <div className={styles.proContainer}>
            {/* Language Switch Component */}
            <div className={styles.proLanguageSwitch} onClick={handleLanguageIconClick}>
                <img src="/images/Prof/language-icon.png" alt={translation.languageIconAlt} />
            </div>
            
            {/* Language Selection Popup */}
            {isLanguagePopupOpen && <LanguageSelectionPopup onClose={() => setIsLanguagePopupOpen(false)} />}

            {/* Title */}
            <h1 className={styles.proMainTitle}>I Need</h1>
            <h2 className={styles.proSubTitle}>{translation.expertInterfaceTitle}</h2>

            {/* Image Section */}
            <div className={styles.proImageContainer}>
                <img src="/images/Prof/worker2.png" alt={translation.workerImageAlt} className={styles.proWorkerImage} />
            </div>

            {/* Message Section */}
            <p className={styles.proMessageText}>{translation.businessCardMessage}</p>

            {/* Button */}
            <button className={styles.proSettingsButton} onClick={handleMySettingsClick}>{translation.mySettingsButtonLabel}</button>
        </div>
    );
}

export default ExpertInterface;
