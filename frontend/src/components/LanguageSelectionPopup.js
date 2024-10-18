import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/LanguageSelectionPopup.module.css';

function LanguageSelectionPopup({ onClose }) {
    const { language, setLanguage } = useLanguage();

    // Handle language change
    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        console.log(event.target.value);
        onClose(); // Close the popup after language selection
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popupContainer}>
                {/* Close Button */}
                <button onClick={onClose} className={styles.closeButton}>
                    &times;
                </button>

                {/* Title */}
                <h2>בחר את שפת הממשק</h2>

                {/* Icon under the title (decorative only) */}
                <div className={styles.popupLanguageIconContainer}>
                    <img
                        src="/images/Prof/languag01.png"
                        alt="Language Icon in Popup"
                        className={styles.popupLanguageIcon}
                    />
                </div>

                {/* Language Selection List */}
                <ul className={styles.languageList}>
                    {[
                        { id: 'he', label: 'עברית' },
                        { id: 'en', label: 'English' },
                        { id: 'es', label: 'Español' },
                        { id: 'ar', label: 'عربي' },
                        { id: 'ru', label: 'Русский' },
                    ].map((lang) => (
                        <li key={lang.id}>
                            <label>
                                {lang.label}
                                <input
                                    type="radio"
                                    name="language"
                                    value={lang.id}
                                    checked={language === lang.id}
                                    onChange={handleLanguageChange}
                                    className={styles.radioButton}
                                />
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default LanguageSelectionPopup;
