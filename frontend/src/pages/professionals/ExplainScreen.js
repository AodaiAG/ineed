import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from '../../styles/ExplainScreen.module.css'; // Make sure to create this CSS file for unique styling

function ExplainScreen() {
    const navigate = useNavigate();
    const { translation } = useLanguage(); // Using the translation from the context

    // Handle the "Continue" button click
    const handleContinueClick = () => {
        navigate('/pro/enter'); // Adjust this to the desired route for the next page
    };

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    return (
        <div className={styles.explainContainer}>
            {/* Greeting Text */}
            <div className={styles.greetingSection}>
                <p>{translation.greetingLine1}</p>
                <p>{translation.greetingLine2}</p>
            </div>

            {/* Why Choose Us Section */}
            <div className={styles.whyUsSection}>
                <p>{translation.whyChooseUs}</p>
                <ul className={styles.whyUsList}>
                    <li>{translation.whyPoint1}</li>
                    <li>{translation.whyPoint2}</li>
                    <li>{translation.whyPoint3}</li>
                    <li>{translation.whyPoint4}</li>
                </ul>
            </div>

            {/* Footer Note */}
            <div className={styles.footerNoteSection}>
                <p>{translation.footerNote}</p>
            </div>

            {/* Image */}
            <div className={styles.characterImageContainer}>
                <img src="/images/Prof/s2.png" alt={translation.professionalImageAlt} className={styles.characterImage} />
            </div>

            {/* Continue Button */}
            <button className={styles.continueButton} onClick={handleContinueClick}>
                {translation.continueButton}
            </button>
        </div>
    );
}

export default ExplainScreen;
