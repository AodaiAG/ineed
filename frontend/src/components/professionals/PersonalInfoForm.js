// src/components/professionals/PersonalInfoForm.jsx
import React, { useRef } from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';

function PersonalInfoForm({ 
    fullName, setFullName, 
    phoneNumber, 
    email, setEmail, 
    website, setWebsite, 
    businessName, setBusinessName,
    image, setImage 
}) {
    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const targetWidth = 300;
                    const targetHeight = 200;
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                    const resizedImageUrl = canvas.toDataURL('image/jpeg');
                    setImage(resizedImageUrl);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className={styles['pro-form-group']}>
            {/* Full Name Input */}
            <label htmlFor="fullName" className={styles['pro-label']}>שם פרטי ומשפחה:</label>
            <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder="דני שובבני"
            />

            {/* Phone Number (Read-Only) */}
            <label htmlFor="phone" className={styles['pro-label']}>טלפון:</label>
            <input
                type="text"
                id="phone"
                value={phoneNumber}
                readOnly
                disabled
                className={`${styles['pro-input']} ${styles['pro-input-disabled']}`}
            />
            <p className={styles['pro-note']}>*להחלפת מספר צור קשר עם השירות <a href="#">כאן</a></p>

            {/* Image Upload Section */}
            <label className={styles['pro-label']}>הוסף תמונה</label>
            <div className={styles['pro-image-upload']}>
                <img src={image} alt="Professional Image" className={styles['pro-image-preview']} />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
                <button type="button" className={styles['pro-upload-button']} onClick={handleUploadButtonClick}>
                    הוסף תמונה
                </button>
            </div>
            <p className={styles['pro-note']}>*בעלי תמונה מקבלים יותר פניות</p>

            {/* Email Input */}
            <label htmlFor="email" className={styles['pro-label']}>אימייל שלי:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder="example@gmail.com"
            />

            {/* Website Input */}
            <label htmlFor="website" className={styles['pro-label']}>האתר שלי:</label>
            <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder="www.example.com"
            />

            {/* Business Name Input */}
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
