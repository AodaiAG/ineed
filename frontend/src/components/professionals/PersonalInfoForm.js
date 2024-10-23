import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from '../../styles/ProfessionalRegistration.module.css';
import LocationComponentPopup from './LocationComponentPopup';

function PersonalInfoForm({
    fullName, setFullName,
    phoneNumber,
    email, setEmail,
    website, setWebsite,
    businessName, setBusinessName,
    location, setLocation, // Add location and setLocation props here
    image, setImage,
    errors, // Error messages passed from parent component
    refs // Refs passed from parent component to scroll to each field
}) {
    const { translation } = useLanguage();
    const { fullNameRef, emailRef, websiteRef,locationRef } = refs; // Destructure refs

    const fileInputRef = useRef(null);
    const [showLocationPopup, setShowLocationPopup] = useState(false);

    // Initialize hooks at the top level to ensure they always run in the same order
    useEffect(() => {
        console.log('Location received in PersonalInfoForm:', location);
    }, [location]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set the desired target width while preserving the aspect ratio
                    const targetWidth = 300;
                    const scaleFactor = targetWidth / img.width;
                    const targetHeight = img.height * scaleFactor;
    
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                    
                    // Set high-quality JPEG output
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

    const handleFullNameChange = (e) => {
        const value = e.target.value;
        // Allow only alphabetic characters from any language and spaces
        if (/^[\p{L}\s]*$/u.test(value)) {
            setFullName(value);
        }
    };

    const handleLocationInputClick = () => {
        setShowLocationPopup(true); // Show the location popup when the input is clicked
    };

    const handleLocationSelect = (selectedLocation) => {
        console.log('Location selected in PersonalInfoForm:', selectedLocation);
        setLocation({
            address: selectedLocation.address,
            lat: selectedLocation.lat,
            lon: selectedLocation.lon,
        }); // Use setLocation from props to update the location in the main component

        setShowLocationPopup(false); // Hide the popup after selecting a location
    };

    const handleLocationPopupClose = () => {
        setShowLocationPopup(false); // Close the popup without selecting a location
    };

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    return (
        <div className={styles['pro-form-group']}>
            {/* Full Name Input */}
            <label htmlFor="fullName" className={styles['pro-label']}>{translation.fullNameLabel}</label>
            {errors.fullName && <p className={styles['pro-error']}>{errors.fullName}</p>} {/* Error Message Above */}
            <input
                type="text"
                id="fullName"
                ref={fullNameRef} // Attach the ref to this input
                value={fullName}
                inputMode="text" // Guide mobile devices to show the alphabetic keyboard
                onChange={handleFullNameChange}
                className={`${styles['pro-input']} ${styles['pro-input-white']} ${errors.fullName ? styles['pro-input-error'] : ''}`}
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
            {errors.email && <p className={styles['pro-error']}>{errors.email}</p>} {/* Error Message Above */}
            <input
                type="email"
                id="email"
                ref={emailRef} // Attach the ref to this input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']} ${errors.email ? styles['pro-input-error'] : ''}`}
                placeholder={translation.emailPlaceholder}
            />

            {/* Website Input */}
            <label htmlFor="website" className={styles['pro-label']}>{translation.websiteLabel}</label>
            {errors.website && <p className={styles['pro-error']}>{errors.website}</p>} {/* Error Message Above */}
            <input
                type="text"
                id="website"
                ref={websiteRef} // Attach the ref to this input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={`${styles['pro-input']} ${styles['pro-input-white']} ${errors.website ? styles['pro-input-error'] : ''}`}
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

            {/* Location Input */}
            <div ref={locationRef}>
                <label htmlFor="location" className={styles['pro-label']}>
                    {translation.location.selectLocation}
                </label>
                {errors.location && (
                    <p className={styles['pro-error']}>{errors.location}</p>
                )}
                <input
                    type="text"
                    id="location"
                    value={location?.address || ''}
                    readOnly
                    onClick={handleLocationInputClick}
                    className={`${styles['pro-input']} ${styles['pro-input-white']} ${errors.location ? styles['pro-input-error'] : ''}`}
                    placeholder={translation.location.locationPlaceholder}
                />
                {showLocationPopup && (
                    <LocationComponentPopup
                        onClose={() => setShowLocationPopup(false)}
                        onSelect={handleLocationSelect}
                        initialLocation={location}
                    />
                )}
            </div>
        </div>
    );
}

export default PersonalInfoForm;
