// src/components/OrientationHandler.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/OrientationHandler.module.css';

const OrientationHandler = ({ children }) => {
    const [isPortrait, setIsPortrait] = useState(
        window.matchMedia("(orientation: portrait) and (max-width: 768px)").matches
    );

    const handleOrientationChange = () => {
        setIsPortrait(window.matchMedia("(orientation: portrait) and (max-width: 768px)").matches);
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait) and (max-width: 768px)");
        mediaQuery.addEventListener("change", handleOrientationChange);
        
        // Initial check
        handleOrientationChange();

        return () => mediaQuery.removeEventListener("change", handleOrientationChange);
    }, []);

    // Show the message only if the device is in landscape and has a width of 768px or less
    if (!isPortrait && window.innerWidth <= 768) {
        return (
            <div className={styles.orientationWarning}>
                Please rotate your device to portrait mode for the best experience.
            </div>
        );
    }

    return children;
};

export default OrientationHandler;
