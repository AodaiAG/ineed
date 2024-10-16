import React from 'react';
import styles from '../../styles/ExpertInterface.module.css';

function ExpertInterface() {
    return (
        <div className={styles.proContainer}>
            {/* Language Switch Icon */}
            <div className={styles.proLanguageSwitch}>
                <img src="/images/prof/language-icon.png" alt="Switch Language" />
            </div>

            {/* Title */}
            <h1 className={styles.proMainTitle}>I Need</h1>
            <h2 className={styles.proSubTitle}>ממשק המומחים</h2>

            {/* Image Section */}
            <div className={styles.proImageContainer}>
                <img src="/images/prof/worker2.png" alt="Worker Image" className={styles.proWorkerImage} />
            </div>

            {/* Message Section */}
            <p className={styles.proMessageText}>כרטיס הביקור שלך מחכה לך ב-SMS</p>

            {/* Button */}
            <button className={styles.proSettingsButton}>ההגדרות שלי</button>
        </div>
    );
}

export default ExpertInterface;
