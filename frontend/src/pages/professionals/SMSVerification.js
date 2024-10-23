import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext'; // Import language context
import styles from '../../styles/SMSVerification.module.css'; // Import the scoped CSS module
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie library

import { API_URL } from '../../utils/constans'; // Assuming the URL is in constants

function SMSVerification() {
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isError, setIsError] = useState(false);
    const [shake, setShake] = useState(false);
    const { translation } = useLanguage(); // Using the translation from the context

    useEffect(() => {
        // Add a unique class to the body element for SMSVerification
        document.body.classList.add(styles.smsVerification_body);

        // Clean up by removing the unique class when the component is unmounted
        return () => {
            document.body.classList.remove(styles.smsVerification_body);
        };
    }, []);

    useEffect(() => {
        // Get the phone number from session storage
        const storedPhoneNumber = sessionStorage.getItem('professionalPhoneNumber');
        if (!storedPhoneNumber) {
            // Redirect back if no phone number found
            navigate('/pro');
        } else {
            setPhoneNumber(storedPhoneNumber);
        }
    }, [navigate]);

    const handleInputChange = (index, value) => {
        // Allow only numeric input
        if (/^\d*$/.test(value)) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);
    
            // Automatically move to next input if a value is entered
            if (value && index < 3) {
                document.getElementById(`code-${index + 1}`).focus();
            }
        }
    };

    const handleVerification = async () => {
        const code = verificationCode.join('');
        if (code.length === 4) {
            const storedCode = sessionStorage.getItem('smsVerificationCode');
            if (code === storedCode) {
                try {
                    const response = await axios.post(`${API_URL}/professionals/check-if-registered`, {
                        phoneNumber,
                    });
                    if (response.data.registered) {
                        sessionStorage.setItem('professionalId', response.data.id);
                        Cookies.set('userSession', response.data.id, { expires: 7 });
                        navigate('/pro/expert-interface');
                    } else {
                        navigate('/pro/register');
                    }
                } catch (error) {
                    console.error('Verification failed:', error);
                    triggerErrorAnimation();
                }
            } else {
                triggerErrorAnimation();
            }
        } else {
            triggerErrorAnimation();
        }
    };

    const triggerErrorAnimation = () => {
        setIsError(true);
        setShake(true);
        setVerificationCode(['', '', '', '']);

        // Reset the shake animation after it's done
        setTimeout(() => {
            setShake(false);
        }, 500);
    };

    const handleBack = () => {
        navigate('/pro/enter'); // Redirect back to phone entry screen
    };

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    return (
        <div className={styles.smsVerification_container}>
            <div className={styles.smsVerification_content}>
                <h1 className={styles.smsVerification_validationTitle}>{translation.phoneValidationTitle}</h1>

                <div className={styles.smsVerification_phoneField}>
                    <label htmlFor="phone" className={styles.smsVerification_phoneLabel}>
                        {translation.phoneLabel}
                    </label>
                    <input
                        type="text"
                        id="smsVerification_phone"
                        value={phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                        readOnly
                        className={styles.smsVerification_phone}
                    />
                </div>

                <p className={styles.smsVerification_smsCodeLabel}>
                    {isError ? translation.wrongCodeMessage : translation.enterCodeMessage}
                </p>
                <div className={`${styles.smsVerification_smsCodeInput} ${shake ? styles.smsVerification_shake : ''}`}>
                    {verificationCode.map((digit, index) => (
                        <input
                            key={index}
                            type="tel"
                            id={`code-${index}`}
                            maxLength="1"
                            className={`${styles.smsVerification_smsBox} ${isError ? styles.smsVerification_error : ''}`}
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            inputMode="numeric"
                            pattern="\d*"
                        />
                    ))}
                </div>

                <div className={styles.smsVerification_actionButtons}>
                    <button className={styles.smsVerification_button} onClick={handleVerification}>
                        {isError ? translation.tryAgainButton : translation.okButton}
                    </button>
                    {isError && (
                        <button className={styles.smsVerification_button} onClick={handleBack}>
                            {translation.backButton}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SMSVerification;
