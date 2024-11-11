// src/components/OrientationHandler.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/OrientationHandler.module.css'; // Add some styles for the message

const OrientationHandler = ({ children }) => {
    const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);

    const handleOrientationChange = () => {
        setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia("(orientation: portrait)");
        mediaQuery.addEventListener("change", handleOrientationChange);
        return () => mediaQuery.removeEventListener("change", handleOrientationChange);
    }, []);

    if (!isPortrait) {
        return (
            <div className={styles.orientationWarning}>
                Please rotate your device to portrait mode for the best experience.
            </div>
        );
    }

    return children;
};

export default OrientationHandler;
