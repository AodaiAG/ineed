import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constans';
import { useLanguage } from '../../contexts/LanguageContext';

import styles from '../../styles/BusinessCard.module.css';

function BusinessCard() {
    const [professional, setProfessional] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('id');
    const { translation } = useLanguage();


    // State to hold deferred prompt for Add to Home Screen
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        // Add a unique class to the body element for BusinessCard
        document.body.classList.add(styles.businessCard_body);

        const fetchProfessional = async () => {
            try {
                const response = await axios.get(`${API_URL}/professionals/prof-info/${id}`);
                const data = response.data;
                setProfessional(data);
            } catch (error) {
                console.error('Error fetching professional data:', error);
            }
        };

        if (id) {
            fetchProfessional();
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Clean up by removing the unique class when the component is unmounted
        return () => {
            document.body.classList.remove(styles.businessCard_body);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [id]);

    if (!professional) {
        return <div>Loading...</div>;
    }
    if (!translation) {
        return <div>Loading...</div>;
    }

    const handleExplainClick = () => {
        navigate('/pro/explain');
    };

    const handleWebsiteClick = () => {
        let websiteUrl = professional.website;
    
        // Ensure the URL starts with "http://" or "https://"
        if (!/^https?:\/\//i.test(websiteUrl)) {
            websiteUrl = `http://${websiteUrl}`;
        }
    
        window.open(websiteUrl, '_blank');
    };

    const handlePhoneClick = () => {
        // Use window.location.href to directly prompt the dialer without opening a new tab
        window.location.href = `tel:${professional.phoneNumber}`;
    };

    const handleWhatsAppClick = () => {
        // Remove non-digit characters and add the country code if needed
        const cleanedPhoneNumber = professional.phoneNumber.replace(/\D/g, '');
    
        // Assuming the numbers are from Israel, prepend the country code (+972)
        const internationalPhoneNumber = cleanedPhoneNumber.startsWith('0')
            ? `+972${cleanedPhoneNumber.substring(1)}`
            : `+972${cleanedPhoneNumber}`;
    
        // Define the message you want to send
        const message = encodeURIComponent('hi ya prof , ma neshmaaaaaaaaa');
    
        // Redirect to WhatsApp without opening a new tab
        window.location.href = `https://wa.me/${internationalPhoneNumber}?text=${message}`;
    };
    const handleEmailClick = () => {
        window.open(`mailto:${professional.email}`);
    };

    const handleAddToHomeClick = () => {
        if (deferredPrompt) {
            // Show the install prompt if available
            deferredPrompt.prompt(); 
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                setDeferredPrompt(null); // Reset the deferred prompt
            });
        } else {
            // Provide manual instructions for different environments
            if (navigator.userAgent.toLowerCase().includes('iphone') || navigator.userAgent.toLowerCase().includes('ipad')) {
                alert('To add to your home screen, please tap the share button and select "Add to Home Screen".');
            } else if (navigator.userAgent.toLowerCase().includes('android')) {
                alert('To add to your home screen, please open your browser’s menu and select "Add to Home Screen".');
            } else {
                alert('To add to your home screen, please use the appropriate browser options to create a shortcut.');
            }
        }
    };

    const handleNavigateClick = () => {
        const { lat, lon } = professional.location;
        if (lat && lon) {
            // Generate Waze link
            const wazeUrl = `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;
            window.open(wazeUrl, '_blank');
        } else {
            alert('Location information is not available for this professional.');
        }
    };
    return (
        <div className={styles.proContainer}>


            {/* Title Section */}
            <h1 className={styles.proBusinessName}>{professional.fname} {professional.lname}</h1>
            <h2 className={styles.proCompanyType}>{professional.businessName || 'פרילנסר'}</h2>
            {/* Spacer to push footer to the bottom */}
            <div className={styles.spacer}></div>
            

            {/* Image Section */}
            <div className={styles.proImageContainer}>
                <img
                    src={professional.image || '/images/Prof/worker2.png'}
                    alt="Professional"
                    className={styles.proProfileImage}
                />
            </div>
            <div className={styles.spacer}></div>
            {/* Contact Icons Section */}
            <div className={styles.proIconsContainer}>
                <div className={styles.proIcon} onClick={handlePhoneClick}>
                    <img src="/images/Prof/phone-icon.png" alt="Phone Icon" />
                </div>
                <div className={styles.proIcon} onClick={handleWhatsAppClick}>
                    <img src="/images/Prof/whatsapp-icon.png" alt="WhatsApp Icon" />
                </div>
                <div className={styles.proIcon} onClick={handleEmailClick}>
                    <img src="/images/Prof/email-icon.png" alt="Email Icon" />
                </div>
                <div className={styles.proIcon} onClick={handleAddToHomeClick}>
                    <img src="/images/Prof/person-icon.png" alt="Person Icon" />
                </div>
                <div className={styles.proIcon} onClick={handleWebsiteClick}>
                    <img src="/images/Prof/website-icon.png" alt="Website Icon" />
                </div>
                <div className={styles.proIcon} onClick={handleNavigateClick}>
                    <img src="/images/Prof/waze.png" alt="Navigate Icon" />
                </div>
            </div>
            <div className={styles.spacer}></div>
            {/* Footer Section */}
            <div className={styles.proFooter}>
                <div className={styles.proFooterContent}>
                    <img
                        src="/images/Prof/footer-worker.png"
                        alt="Worker Icon"
                        className={styles.proFooterWorkerIcon}
                    />
                    <div className={styles.proFooterText}>
                    <p className={styles.proFooterTextHeader}>I Need</p>
                    <p>{translation.subTitle}</p>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default link behavior
                                handleExplainClick(); // Use navigate for redirection
                            }}
                            className={styles.proExplainLink}
                        >
{translation.wantToJoinPrompt}                        </a>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default BusinessCard;
