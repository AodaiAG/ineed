import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/ExpertMainPage.module.css';
import LanguageSelectionPopup from '../../components/LanguageSelectionPopup';

function ExpertMainPage() {
    const navigate = useNavigate();
    const [isLanguagePopupOpen, setIsLanguagePopupOpen] = React.useState(false);

    // Toggle the language selection popup
    const handleLanguageIconClick = () => {
        setIsLanguagePopupOpen((prev) => !prev);
    };

    // Handle navigation for "Let's Go" button
    const handleCTAClick = () => {
        navigate('/pro/explain');
    };

    return (
        <div className={styles.mainContainer}>
            {/* Trigger Language Selection Popup */}
            <div className={styles.languageIcon} onClick={handleLanguageIconClick}>
                <img src="/images/Prof/languag01.png" alt="Language Icon" />
            </div>

            <h1 className={styles.mainTitle}>I Need</h1>
            <h2 className={styles.subTitle}>כל המומחים במקום אחד</h2>
            <h3 className={styles.expertInterface}>ממשק המומחים</h3>

            {/* Worker Image */}
            <div className={styles.imageContainer}>
                <img src="/images/Prof/w4.png" alt="Worker Image" />
            </div>

            {/* "Let's Go" Button */}
            <button className={styles.ctaButton} onClick={handleCTAClick}>קדימה</button>

            {/* Language Selection Popup - only show when isLanguagePopupOpen is true */}
            {isLanguagePopupOpen && (
                <LanguageSelectionPopup onClose={() => setIsLanguagePopupOpen(false)} />
            )}
        </div>
    );
}

export default ExpertMainPage;
