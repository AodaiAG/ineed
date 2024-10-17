// src/components/professionals/LanguagePreferences.jsx
import React from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';

function LanguagePreferences({ languages, setLanguages }) {
    return (
        <div className={styles['pro-form-group']}>
            <label className={styles['pro-label']}>השפות שלי:</label>
            <div className={styles['pro-checkbox-group']}>
                {Object.keys(languages).map((lang) => (
                    <label key={lang}>
                        <input
                            type="checkbox"
                            checked={languages[lang]}
                            onChange={() => setLanguages((prev) => ({ ...prev, [lang]: !prev[lang] }))}
                        /> {lang}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default LanguagePreferences;
