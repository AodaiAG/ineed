import React from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';
import { languageMapping, getLanguageLabelById } from '../../utils/generalUtils';

function LanguagePreferences({ languages, setLanguages, selectedLanguage = 'he' }) {
    const toggleLanguage = (languageId) => {
        setLanguages((prevLanguages) => {
            if (prevLanguages.includes(languageId)) {
                return prevLanguages.filter((id) => id !== languageId);
            } else {
                return [...prevLanguages, languageId];
            }
        });
    };

    return (
        <div className={styles['pro-form-group']}>
            <label className={styles['pro-label']}>השפות שלי:</label>
            <div className={styles['language-options']}>
                {Object.entries(languageMapping).map(([key, id]) => (
                    <label key={id} className={styles['language-label']}>
                        <input
                            type="checkbox"
                            checked={languages.includes(id)}
                            onChange={() => toggleLanguage(id)}
                        />
                        <span>{getLanguageLabelById(id, selectedLanguage)}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default LanguagePreferences;
