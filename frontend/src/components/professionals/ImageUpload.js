// src/components/professionals/ImageUpload.jsx
import React, { useRef } from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Use original dimensions of the image
                const targetWidth = img.width;
                const targetHeight = img.height;

                canvas.width = targetWidth;
                canvas.height = targetHeight;
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                // Set the JPEG quality to 1.0 (100%) for the highest quality
                const resizedImageUrl = canvas.toDataURL('image/jpeg', 1.0);
                setImage(resizedImageUrl);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
};

export default ImageUpload;
