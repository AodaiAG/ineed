import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        // Add a unique class to the body element for PhoneScreen
        document.body.classList.add(styles.phoneScreen_body);

        // Clean up by removing the unique class when the component is unmounted
        return () => {
            document.body.classList.remove(styles.phoneScreen_body);
        };
    }, []);

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setPhoneNumber(value);
        }
    };

    const handleCountryCodeChange = (e) => {
        setCountryCode(e.target.value);
    };

    const handleEnterClick = async () => {
        if (phoneNumber.trim() !== '') {
            const fullPhoneNumber = `${countryCode}${phoneNumber}`;
            sessionStorage.setItem('professionalPhoneNumber', fullPhoneNumber);

            try {
                const verificationCode = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit code
                const message = `${translation.verificationCodeMessage} ${verificationCode}`;

                sendSms(fullPhoneNumber, message);
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
        <div className={styles.phoneScreen_container}>
            <div className={styles.phoneScreen_content}>
                <h1 className={styles.phoneScreen_mainTitle}>{translation.mainTitle}</h1>
                <p className={styles.phoneScreen_subtitle}>{translation.subtitle}</p>
                <h2 className={styles.phoneScreen_enterTitle}>{translation.enterTitle}</h2>

                <div className={styles.phoneScreen_phoneInputSection}>
                    <label htmlFor="country-code" className={styles.phoneScreen_hiddenLabel}>
                        {translation.countryCodeLabel}
                    </label>
                    <div className={styles.phoneScreen_countryCode}>
                        <select
                            id="country-code"
                            value={countryCode}
                            onChange={handleCountryCodeChange}
                            className={styles.phoneScreen_select}
                        >
                            <option value="050">050</option>
                            <option value="052">052</option>
                            <option value="053">053</option>
                            <option value="054">054</option>
                            <option value="055">055</option>
                            <option value="056">056</option>
                            <option value="057">057</option>
                            <option value="058">058</option>
                            <option value="059">059</option>
                        </select>
                        <div className={`${styles.phoneScreen_arrowBackground}`}>
                            <i className="ri-arrow-down-s-fill dropdown-icon"></i>
                        </div>
                    </div>

                    <label htmlFor="phone-number" className={styles.phoneScreen_hiddenLabel}>
                        {translation.phoneNumberLabel}
                    </label>
                    <input
                        type="tel"
                        id="phone-number"
                        className={styles.phoneScreen_phoneNumber}
                        placeholder={translation.phoneNumberPlaceholder}
                        value={phoneNumber}
                        maxLength="7"
                        pattern="[0-9]*"
                        onChange={handlePhoneNumberChange}
                    />
                </div>

                <p className={styles.phoneScreen_termsText}>
                    {translation.termsText}{' '}
                    <a href="#" className={styles.phoneScreen_termsLink}>
                        {translation.termsLink}
                    </a>
                </p>

                <div className={styles.phoneScreen_illustration}>
                    <img src="/images/Prof/worker.png" alt={translation.workerImageAlt} />
                </div>

                <button className={styles.phoneScreen_enterButton} onClick={handleEnterClick}>
                    {translation.enterButton}
                </button>
            </div>
        </div>
    );
}

export default PhoneScreen;
