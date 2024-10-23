// src/components/professionals/ImageUpload.jsx
import React, { useRef } from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';

function ImageUpload({ image, setImage }) {
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
                    const targetWidth = 1000; // Increased width for much better resolution
                    const targetHeight = 800;  // Increased height for much better resolution
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                    // Set the quality to 1.0 for the best output quality
                    const resizedImageUrl = canvas.toDataURL('image/jpeg', 1.0);
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
        </div>
    );
}

export default ImageUpload;
