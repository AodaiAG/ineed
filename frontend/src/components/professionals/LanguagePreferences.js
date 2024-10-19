import React from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';
import { useLanguage } from '../../contexts/LanguageContext';

function LanguagePreferences({ languages, setLanguages }) {
    const { translation } = useLanguage();

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

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
            <label className={styles['pro-label']}>{translation.languagePreferencesLabel}</label>
            <div className={styles['language-options']}>
                {Object.keys(translation.languages).map((languageKey) => (
                    <label key={languageKey} className={styles['language-label']}>
                        <input
                            type="checkbox"
                            checked={languages.includes(languageKey)}
                            onChange={() => toggleLanguage(languageKey)}
                        />
                        <span>{translation.languages[languageKey]}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default LanguagePreferences;
