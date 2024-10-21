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

    useEffect(() => {
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
    }, [id]);

    const handleAddToHomeClick = () => {
        alert('To add to your home screen, please use the browser options to create a shortcut or "Install App".');
    };

    const handleWebsiteClick = () => {
        if (professional && professional.website) {
            window.open(professional.website, '_blank');
        }
    };

    const handlePhoneClick = () => {
        window.open(`tel:${professional.phoneNumber}`);
    };

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent("Hello, I'm interested in your services.");
        window.open(`https://wa.me/${professional.phoneNumber}?text=${message}`, '_blank');
    };

    const handleEmailClick = () => {
        window.open(`mailto:${professional.email}`);
    };

    if (!professional) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.proContainer}>
            <h1 className={styles.proBusinessName}>{professional.fname} {professional.lname}</h1>
            <h2 className={styles.proCompanyType}>{professional.businessName || 'פרילנסר'}</h2>

            <div className={styles.proImageContainer}>
                <img
                    src={professional.image || '/images/Prof/worker2.png'}
                    alt="Professional"
                    className={styles.proProfileImage}
                />
            </div>

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
            </div>

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
                                navigate('/pro/explain'); // Use navigate for redirection
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
