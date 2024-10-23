import React, { useState, useEffect } from 'react';
import styles from '../../styles/ExpertInterface.module.css';
import { useNavigate } from 'react-router-dom';
import LanguageSelectionPopup from '../../components/LanguageSelectionPopup';
import { useLanguage } from '../../contexts/LanguageContext';

function ExpertInterface() {
    const navigate = useNavigate();
    const { translation } = useLanguage();
    const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);

    useEffect(() => {
        // Add a unique class to the body element for ExpertInterface
        document.body.classList.add(styles.expertInterface_body);

        // Clean up by removing the unique class when the component is unmounted
        return () => {
            document.body.classList.remove(styles.expertInterface_body);
        };
    }, []);

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
            navigate('/pro/edit-settings');
        } else {
            alert(translation.errorOccurredMessage);
        }
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

            {/* Button */}
            <button className={styles.expertInterface_settingsButton} onClick={handleMySettingsClick}>
                {translation.mySettingsButtonLabel}
            </button>
        </div>
    );
}

export default ExpertInterface;
