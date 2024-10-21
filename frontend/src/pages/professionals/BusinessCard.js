import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constans';
import styles from '../../styles/BusinessCard.module.css';

function BusinessCard() {
    const [professional, setProfessional] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('id');

    const [deferredPrompt, setDeferredPrompt] = useState(null); // State to store install prompt event

    useEffect(() => {
        // Fetch Professional Data
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

        // Listen for the "beforeinstallprompt" event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e); // Save the event to be triggered later
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [id]);

    // Function to handle "Add to Home Screen" button click
    const handleAddToHomeClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the install prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                setDeferredPrompt(null); // Reset the deferred prompt
            });
        } else {
            alert('To add to your home screen, please use the browser options to create a shortcut.');
        }
    };

    if (!professional) {
        return <div>Loading...</div>;
    }

    const handleCallClick = () => {
        window.location.href = `tel:${professional.phoneNumber}`;
    };

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/${professional.phoneNumber}`, '_blank');
    };

    const handleEmailClick = () => {
        window.location.href = `mailto:${professional.email}`;
    };

    const handleWebsiteClick = () => {
        window.open(professional.website, '_blank');
    };

    const handleExplainClick = () => {
        navigate('/pro/explain');
    };

    return (
        <div className={styles.proContainer}>
            {/* Title Section */}
            <h1 className={styles.proBusinessName}>{professional.fname} {professional.lname}</h1>
            <h2 className={styles.proCompanyType}>{professional.businessName || 'פרילנסר'}</h2>

            {/* Image Section */}
            <div className={styles.proImageContainer}>
                <img
                    src={professional.image || '/images/Prof/worker2.png'}
                    alt="Professional"
                    className={styles.proProfileImage}
                />
            </div>

            {/* Contact Icons Section */}
            <div className={styles.proIconsContainer}>
                <div className={styles.proIcon} onClick={handleCallClick}>
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
            </div>

            {/* Footer Section */}
            <div className={styles.proFooter}>
                <div className={styles.proFooterContent}>
                    <img
                        src="/images/Prof/footer-worker.png"
                        alt="Worker Icon"
                        className={styles.proFooterWorkerIcon}
                    />
                    <div className={styles.proFooterText}>
                        <p>I Need</p>
                        <p>כל המומחים במקום אחד</p>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default link behavior
                                handleExplainClick(); // Use navigate for redirection
                            }}
                            className={styles.proExplainLink}
                        >
                            גם אתה רוצה? לחץ כאן
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BusinessCard;
