import React, { useState, useEffect } from 'react';
import { Button, Box, TextField } from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext'; // Import language context
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router
import api from '../../utils/clientApi'; // Assuming you've set up an API utility for axios
import styles from '../../styles/client/ClientSMSVerification.module.css'; // Import the scoped CSS module
import { API_URL } from '../../utils/constans';


const SMSVerification = () => {
  const { translation } = useLanguage(); // Using the translation from the context
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isError, setIsError] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  // Fetch phone number from sessionStorage on component mount
  useEffect(() => {

    const storedPhoneNumber =  `${sessionStorage.getItem('phonePrefix')}${sessionStorage.getItem('phoneNumber')}`;

    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    }
  }, []);

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

  const triggerErrorAnimation = () => {
    setIsError(true);
    setShake(true);
    setVerificationCode(['', '', '', '']); // Clear all inputs

    // Reset the shaking animation after it completes
    setTimeout(() => {
      setShake(false);
    }, 500);
  };

  const handleVerification = async () => {
    const code = verificationCode.join('');
    if (code.length === 4) {
      try {
        const response = await api.post(`${API_URL}/verify-code`, {
          phoneNumber,
          code,
        });
  
        if (response.data.success) 
          {

          if(response.data.registered)
          {
                  navigate('/dashboard');

          }
            // If client is not registered, save client and create request
            try {
              // Step 1: Save the client
              const saveClientResponse = await api.post(`${API_URL}/save_client`, {
                phoneNumber,
                fullName: sessionStorage.getItem("fullName") || "Unknown", // Retrieve from sessionStorage or use a default
              });
  
              if (saveClientResponse.data.success) {
                const clientId = saveClientResponse.data.clientId;
  
                // Step 2: Create the request
                const requestDetails = {
                  clientId,
                  jobRequiredId: JSON.parse(sessionStorage.getItem("subProfession"))?.id, // Use jobRequiredId from sessionStorage
                  city: sessionStorage.getItem("city"),
                  date: sessionStorage.getItem("date"),
                  comment: sessionStorage.getItem("comment"),
                };
  
                const submitRequestResponse = await api.post(`${API_URL}/submit_client_request`, requestDetails);
  
                if (submitRequestResponse.data.success) {
                  console.log("Request submitted successfully!");
                  // Navigate to summary page after saving client and request
                  navigate('/dashboard');
                } else {
                  console.error("Failed to submit client request");
                  alert(translation.failedToSubmitRequestMessage || "Failed to submit request.");
                }
              } else {
                console.error("Failed to save client");
                alert(translation.failedToSaveClientMessage || "Failed to save client.");
              }
            } catch (error) {
              console.error("Error saving client or submitting request:", error);
              alert(translation.generalErrorMessage || "An error occurred. Please try again.");
            }
          
        } else {
          // Trigger error animation if the verification fails
          triggerErrorAnimation();
        }
      } catch (error) {
        console.error('Verification failed:', error);
        triggerErrorAnimation();
      }
    } else {
      triggerErrorAnimation();
    }
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
              borderRadius: '14px', // Apply border-radius
              fontSize: '1.6rem', // Medium font size
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
