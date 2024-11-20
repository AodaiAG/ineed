import React, { useState } from 'react';
import { Button, Box, TextField } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext'; // Import language context
import styles from '../../styles/client/ClientSMSVerification.module.css'; // Import the scoped CSS module

const SMSVerification = () => {
  const { translation } = useLanguage(); // Using the translation from the context
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [phoneNumber] = useState('054-123-4567'); // Replace with actual data from context or props
  const [isError, setIsError] = useState(false);
  const [shake, setShake] = useState(false);

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

  

  const handleVerification = () => {
    const code = verificationCode.join('');
    if (code === '1111') {
      alert('Verification successful!');
      // Navigate to the next page or handle success
    } else {
      triggerErrorAnimation();
    }
  };

  const triggerErrorAnimation = () => {
    setIsError(true);
    setShake(true);
    setVerificationCode(['', '', '', '']); // Clear all inputs
  
    // Reset the shaking animation after it completes
    setTimeout(() => {
      setShake(false);

    }, 500);
    


  };
  

  return (
    <Box className={styles.smsClientVerification_container}>
      <Box className={styles.smsClientVerification_content}>
        <h1 className={styles.smsClientVerification_validationTitle}>
          {translation?.phoneValidationTitle || 'רק נוודא שזה אתה'}
        </h1>

        <Box className={styles.smsClientVerification_phoneField}>
          <label className={styles.smsClientVerification_phoneLabel}>
            {translation?.phoneLabel || 'טלפון:'}
          </label>
          <TextField
            value={phoneNumber}
            variant="outlined"
            fullWidth
            className={styles.smsClientVerification_phone}
            InputProps={{
              readOnly: true,
              style: {
                textAlign: 'center',
                backgroundColor: '#979797',
                borderRadius: '8px',
                color: '#fff',
              },
            }}
          />
        </Box>

        <p className={styles.smsClientVerification_smsCodeLabel}>
          {isError
            ? translation?.wrongCodeMessage || 'הקוד שהכנסת שגוי, נסה שוב'
            : translation?.enterCodeMessage || 'הכנס את הקוד שקיבלת ב-SMS'}
        </p>

        <Box
          className={`${styles.smsClientVerification_smsCodeInput} ${
            shake ? styles.smsClientVerification_shake : ''
          }`}
        >
          {verificationCode.map((digit, index) => (
            <input
            key={index}
            type="tel"
            id={`code-${index}`} // Ensure this matches the focus logic
            maxLength="1"
            className={`${styles.smsClientVerification_smsBox} ${
              isError ? styles.smsClientVerification_error : ''
            }`}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            inputMode="numeric"
            pattern="\d*"
          />
          
          ))}
        </Box>

        {isError && (
          <p className={styles.smsClientVerification_countdown}>
            00:59 {/* Example countdown timer */}
          </p>
        )}

        <Box className={styles.smsClientVerification_actionButtons}>
          <Button
            variant="contained"
            onClick={handleVerification}
            className={styles.smsClientVerification_button}
            sx={{
              borderRadius: "14px", // Apply border-radius
              fontSize: "1.6rem", // Medium font size
            }}
          >
            {isError
              ? translation?.tryAgainButton || 'נסה שוב'
              : translation?.okButton || 'אישור'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SMSVerification;
