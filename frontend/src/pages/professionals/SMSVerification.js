import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/SMSVerification.module.css'; // Import the scoped CSS module
import axios from 'axios';
import { API_URL } from '../../utils/constans'; // Assuming the URL is in constants

function SMSVerification() {
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isError, setIsError] = useState(false);
    const [shake, setShake] = useState(false);

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
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Automatically move to next input if a value is entered
        if (value && index < 3) {
            document.getElementById(`code-${index + 1}`).focus();
        }
    };

    const handleVerification = async () => {
        const code = verificationCode.join('');
        if (code.length === 4) {
            // Check if the code matches the one stored in sessionStorage
            const storedCode = sessionStorage.getItem('smsVerificationCode');
            if (code === storedCode) {
                try {
                    // Make a request to verify or create the professional
                    const response = await axios.post(`${API_URL}/professionals/verify-or-create`, {
                        phoneNumber,
                    });
    
                    if (response.data.success) {
                        alert('Phone verified successfully.');
                        // Redirect to dashboard or registration based on user's status
                        navigate('/pro/dashboard');
                        // Example route after successful verification
                    } else {
                        // If there's an issue with backend processing, display an error
                        alert('Verification failed. Please try again.');
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

    return (
        <div className={styles['pro-container']}>
            <div className={styles['pro-content']}>
                <h1 className={styles['pro-validation-title']}>Phone Validation</h1>

                <div className={styles['pro-phone-field']}>
                    <label htmlFor="phone" className={styles['pro-phone-label']}>Phone</label>
                    <input
                        type="text"
                        id="pro-phone"
                        value={phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                        readOnly
                        className={styles['pro-phone']}
                    />
                </div>

                <p className={styles['pro-sms-code-label']}>
                    {isError ? 'You entered the wrong code' : 'Enter the code you received'}
                </p>
                <div className={`${styles['pro-sms-code-input']} ${shake ? styles['shake'] : ''}`}>
                    {verificationCode.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            id={`code-${index}`}
                            maxLength="1"
                            className={`${styles['pro-sms-box']} ${isError ? styles['pro-error'] : ''}`}
                            value={digit}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                    ))}
                </div>

                <div className={styles['pro-action-buttons']}>
                    <button className={styles['pro-button']} onClick={handleVerification}>
                        {isError ? 'Try Again' : 'OK'}
                    </button>
                    {isError && (
                        <button className={styles['pro-button']} onClick={handleBack}>
                            Back
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SMSVerification;
