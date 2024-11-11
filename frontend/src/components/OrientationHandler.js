// src/components/OrientationHandler.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/OrientationHandler.module.css';

const OrientationHandler = ({ children }) => {
    const [isPortrait, setIsPortrait] = useState(true);
    const isMobileDevice = /iPhone|Android/i.test(navigator.userAgent);

    const checkOrientation = () => {
        const portrait = window.matchMedia("(orientation: portrait)").matches || window.innerHeight > window.innerWidth;
        setIsPortrait(portrait);
    };

    useEffect(() => {
        if (isMobileDevice) {
            checkOrientation(); // Initial check
            window.addEventListener("resize", checkOrientation);
            window.addEventListener("orientationchange", checkOrientation);

            return () => {
                window.removeEventListener("resize", checkOrientation);
                window.removeEventListener("orientationchange", checkOrientation);
            };
        }
    }, [isMobileDevice]);

    // Show the warning only on mobile devices and in landscape mode
    if (!isPortrait && isMobileDevice) {
        return (
            <div className={styles.orientationWarning}>
                Please rotate your device to portrait mode for the best experience.
            </div>
        );
    }

    return children;
};

export default OrientationHandler;
