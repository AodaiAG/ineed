import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext'; // Import language context
import styles from '../../styles/PhoneScreen.module.css'; // Use module CSS for styles
import 'remixicon/fonts/remixicon.css'; // Include Remixicon for the arrow icon
import { sendSms } from '../../utils/generalUtils'; // Import sendSms from utils

function PhoneScreen() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('052');
    const { translation } = useLanguage(); // Using the translation from the context

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleCountryCodeChange = (e) => {
        setCountryCode(e.target.value);
    };

    const handleEnterClick = async () => {
        if (phoneNumber.trim() !== '') {
            const fullPhoneNumber = `${countryCode}${phoneNumber}`;
            sessionStorage.setItem('professionalPhoneNumber', fullPhoneNumber);

            // Send SMS using generalUtils function
            try {
                const verificationCode = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit code
                const message = `${translation.verificationCodeMessage} ${verificationCode}`;

                sendSms(fullPhoneNumber, message);
                // Store the verification code in sessionStorage for verification purposes
                sessionStorage.setItem('smsVerificationCode', verificationCode);

                navigate('/pro/sms-verification'); // Redirect to the SMS verification page
            } catch (error) {
                console.error('Failed to send SMS:', error);
                alert(translation.failedToSendSmsMessage);
            }
        } else {
            alert(translation.enterPhoneNumberMessage);
        }
    };

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    return (
        <div className={styles['pro-container']}>
            <div className={styles['pro-content']}>
                <h1 className={styles['pro-main-title']}>{translation.mainTitle}</h1>
                <p className={styles['pro-subtitle']}>{translation.subtitle}</p>
                <h2 className={styles['pro-enter-title']}>{translation.enterTitle}</h2>

                <div className={styles['pro-phone-input-section']}>
                    <label htmlFor="country-code" className={styles['pro-hidden-label']}>
                        {translation.countryCodeLabel}
                    </label>
                    <div className={styles['pro-country-code']}>
                        <select
                            id="country-code"
                            value={countryCode}
                            onChange={handleCountryCodeChange}
                            className={styles['pro-select']}
                        >
                            <option value="052">052</option>
                            <option value="054">054</option>
                            <option value="055">055</option>
                            <option value="056">056</option>
                            <option value="057">057</option>
                            <option value="058">058</option>
                            <option value="059">059</option>
                        </select>
                        <div className={`${styles['arrow-background']}`}>
                            <i className="ri-arrow-down-s-fill dropdown-icon"></i>
                        </div>
                    </div>

                    <label htmlFor="phone-number" className={styles['pro-hidden-label']}>
                        {translation.phoneNumberLabel}
                    </label>
                    <input
                        type="text"
                        id="pro-phone-number"
                        className={styles['pro-phone-number']}
                        placeholder={translation.phoneNumberPlaceholder}
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                    />
                </div>

                <p className={styles['pro-terms-text']}>
                    {translation.termsText}{' '}
                    <a href="#" className={styles['pro-terms-link']}>
                        {translation.termsLink}
                    </a>
                </p>

                <div className={styles['pro-illustration']}>
                    <img src="/images/Prof/worker.png" alt={translation.workerImageAlt} />
                </div>

                <button className={styles['pro-enter-button']} onClick={handleEnterClick}>
                    {translation.enterButton}
                </button>
            </div>
        </div>
    );
}

export default PhoneScreen;
