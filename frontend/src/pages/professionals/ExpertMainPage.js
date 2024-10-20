import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/ExpertMainPage.module.css';
import LanguageSelectionPopup from '../../components/LanguageSelectionPopup';
import Cookies from 'js-cookie'; // Import js-cookie library

import { useLanguage } from '../../contexts/LanguageContext';

function ExpertMainPage() {
    const navigate = useNavigate();
    const [isLanguagePopupOpen, setIsLanguagePopupOpen] = React.useState(false);
    const { translation } = useLanguage();
    useEffect(() => {
        const userSession = Cookies.get('userSession');
        if (userSession) {
            // Set professionalId in sessionStorage if it exists
            sessionStorage.setItem('professionalId', userSession);

            // Redirect user to the expert interface
            navigate('/pro/expert-interface');
        }
    }, [navigate]);


    // Toggle the language selection popup
    const handleLanguageIconClick = () => {
        setIsLanguagePopupOpen((prev) => !prev);
    };

    // Handle navigation for "Let's Go" button
    const handleCTAClick = () => {
        navigate('/pro/explain');
    };

    if (!translation) {
        return <div>Loading...</div>; // Add a fallback to prevent accessing `null` properties
    }

    return (
        <div className={styles.mainContainer}>
            {/* Trigger Language Selection Popup */}
            <div className={styles.languageIcon} onClick={handleLanguageIconClick}>
                <img src="/images/Prof/languag01.png" alt={translation.languageIconAlt} />
            </div>

            <h1 className={styles.mainTitle}>I Need</h1>
            <h2 className={styles.subTitle}>{translation.subTitle}</h2>
            <h3 className={styles.expertInterface}>{translation.expertInterface}</h3>

            {/* Worker Image */}
            <div className={styles.imageContainer}>
                <img src="/images/Prof/w4.png" alt={translation.workerImageAlt} />
            </div>

            {/* "Let's Go" Button */}
            <button className={styles.ctaButton} onClick={handleCTAClick}>
                {translation.letsGoButton}
            </button>

            {/* Language Selection Popup - only show when isLanguagePopupOpen is true */}
            {isLanguagePopupOpen && (
                <LanguageSelectionPopup onClose={() => setIsLanguagePopupOpen(false)} />
            )}
        </div>
    );
}

export default ExpertMainPage;
