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
               console.log(response.data)
                setProfessional(data);
            } catch (error) {
                console.error('Error fetching professional data:', error);
            }
        };

        if (id) {
            fetchProfessional();
        }
    }, [id]);

    if (!professional) {
        return <div>Loading...</div>;
    }

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
                <div className={styles.proIcon}>
                    <img src="/images/Prof/phone-icon.png" alt="Phone Icon" />
                </div>
                <div className={styles.proIcon}>
                    <img src="/images/Prof/whatsapp-icon.png" alt="WhatsApp Icon" />
                </div>
                <div className={styles.proIcon}>
                    <img src="/images/Prof/email-icon.png" alt="Email Icon" />
                </div>
                <div className={styles.proIcon}>
                    <img src="/images/Prof/person-icon.png" alt="Person Icon" />
                </div>
                <div className={styles.proIcon}>
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
