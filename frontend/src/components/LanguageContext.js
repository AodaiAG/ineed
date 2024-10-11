// src/context/LanguageContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import translationsData from '../utils/translations.json'; // Import your translations file

// Create a context for managing language state globally
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Function to detect the browser language
    const detectBrowserLanguage = () => {
        const userLanguage = navigator.language || navigator.languages[0]; // Get browser language
        const languageCode = userLanguage.split('-')[0]; // Extract language part (e.g., 'en' from 'en-US')
        return translationsData[languageCode] ? languageCode : 'he'; // Fallback to Hebrew if not found
    };

    // Initial state for the language and translation
    const [language, setLanguage] = useState(detectBrowserLanguage); // Default to browser language
    const [translation, setTranslation] = useState(translationsData[detectBrowserLanguage()]); // Load initial translations

    // Update translation when the language changes
    useEffect(() => {
        setTranslation(translationsData[language]); // Update translation when the language state changes
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translation }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook to use the LanguageContext values in other components
export const useLanguage = () => useContext(LanguageContext);
