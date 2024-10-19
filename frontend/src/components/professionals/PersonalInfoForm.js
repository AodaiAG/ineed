import React, { useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext'; // Import language context
import styles from '../../styles/ProfessionalRegistration.module.css';

function PersonalInfoForm({ 
    fullName, setFullName, 
    phoneNumber, 
    email, setEmail, 
    website, setWebsite, 
    businessName, setBusinessName,
    image, setImage 
}) {
    const { translation } = useLanguage(); // Get translation from context
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

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    return (
        <div className={styles['pro-form-group']}>
            {/* Full Name Input */}
            <label htmlFor="fullName" className={styles['pro-label']}>{translation.fullNameLabel}</label>
            <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder={translation.fullNamePlaceholder}
            />

            {/* Phone Number (Read-Only) */}
            <label htmlFor="phone" className={styles['pro-label']}>{translation.phoneLabel}</label>
            <input
                type="text"
                id="phone"
                value={phoneNumber}
                readOnly
                disabled
                className={`${styles['pro-input']} ${styles['pro-input-disabled']}`}
            />
            <p className={styles['pro-note']}>{translation.phoneNote} <a href="#">{translation.contactLink}</a></p>

            {/* Image Upload Section */}
            <label className={styles['pro-label']}>{translation.addImageLabel}</label>
            <div className={styles['pro-image-upload']}>
                <img src={image} alt={translation.imageAlt} className={styles['pro-image-preview']} />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
                <button type="button" className={styles['pro-upload-button']} onClick={handleUploadButtonClick}>
                    {translation.addImageButton}
                </button>
            </div>
            <p className={styles['pro-note']}>{translation.addImageNote}</p>

            {/* Email Input */}
            <label htmlFor="email" className={styles['pro-label']}>{translation.emailLabel}</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder={translation.emailPlaceholder}
            />

            {/* Website Input */}
            <label htmlFor="website" className={styles['pro-label']}>{translation.websiteLabel}</label>
            <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder={translation.websitePlaceholder}
            />

            {/* Business Name Input */}
            <label htmlFor="businessName" className={styles['pro-label']}>{translation.businessNameLabel}</label>
            <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                placeholder={translation.businessNamePlaceholder}
            />
        </div>
    );
}

export default PersonalInfoForm;
