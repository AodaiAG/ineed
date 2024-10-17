import React from 'react';
import styles from '../../styles/ExpertInterface.module.css';
import { useNavigate } from 'react-router-dom';

function ExpertInterface() {
    const navigate = useNavigate();
    
    const handleMySettingsClick = () => {
        const id = sessionStorage.getItem('professionalId');
        if (id) {
            // Navigate to the settings page with the user's ID as a query parameter
            navigate('/pro/edit-settings');
        }
        else{
            alert('Error Occoured , try again later -.-')
        }
    };
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
            <button className={styles.proSettingsButton} onClick={handleMySettingsClick}>ההגדרות שלי</button>
        </div>
    );
}

export default ExpertInterface;
