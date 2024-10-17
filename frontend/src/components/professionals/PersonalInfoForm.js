// src/components/professionals/PersonalInfoForm.jsx
import React from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';

function PersonalInfoForm({ fullName, setFullName, email, setEmail, website, setWebsite, businessName, setBusinessName }) {
    return (
        <div className={styles['pro-form-group']}>
            <label htmlFor="fullName" className={styles['pro-label']}>שם פרטי ומשפחה:</label>
            <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder="דני שובבני"
            />

            <label htmlFor="email" className={styles['pro-label']}>אימייל שלי:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder="example@gmail.com"
            />

            <label htmlFor="website" className={styles['pro-label']}>האתר שלי:</label>
            <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder="www.example.com"
            />

            <label htmlFor="businessName" className={styles['pro-label']}>שם העסק שלי:</label>
            <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder="שם העסק"
            />
        </div>
    );
}

export default PersonalInfoForm;
