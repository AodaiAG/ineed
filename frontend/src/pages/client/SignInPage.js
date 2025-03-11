import React, { useState } from "react";
import { Box, Button, TextField, Typography, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/client/SignInPage.module.css";
import { useLanguage } from "../../contexts/LanguageContext"; // Import useLanguage for translations
import { useMessage } from "../../contexts/MessageContext";


import { API_URL } from '../../utils/constans';

const SignInPage = () => {
  const { translation } = useLanguage(); // Access translations

  const [countryCode, setCountryCode] = useState("052");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSending, setIsSending] = useState(false); // State to handle loading state
  const navigate = useNavigate();
  const { showMessage } = useMessage();

  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleSignIn = async () => {
    if (phoneNumber.length !== 7) {
      showMessage("מספר הטלפון חייב להכיל בדיוק 7 ספרות", "error"); // ❌ Error message
      return;
    }
  
    try {
      setIsSending(true);
      
      // Save phone number and country code to sessionStorage
      sessionStorage.setItem("phonePrefix", countryCode);
      sessionStorage.setItem("phoneNumber", phoneNumber);
  
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      console.log("Full Phone Number:", fullPhoneNumber);
  
      // Send SMS via API
      await axios.post(`${API_URL}/professionals/send-sms`, {
        phoneNumber: fullPhoneNumber,
        message: translation.verificationCodeMessage + " {code}",
      });
  
      console.log("SMS sent successfully.");
  
      // Navigate to the SMS verification page
      navigate("/sms");
    } catch (error) {
      console.error("Error sending SMS:", error);
      showMessage("שליחת ה-SMS נכשלה. נסה שוב.", "error"); // ❌ Error message
    } finally {
      setIsSending(false);
    }
  };
  

  return (
    <Box className={styles.container}>
      {/* Title */}
      <Typography variant="h3" className={styles.mainTitle}>
        I Need
      </Typography>

      {/* Subtitle */}
      <Typography variant="h6" className={styles.subtitle}>
        כל המומחים במקום אחד
      </Typography>

      {/* Sign-In Prompt */}
      <Typography variant="h5" className={styles.signInText}>
        כניסה למערכת
      </Typography>

      {/* Phone Number Input Section */}
      <Typography variant="subtitle1" className={styles.phonePrompt}>
        הכנס את מספר הטלפון שלך:
      </Typography>

      <Box className={styles.inputContainer}>
        {/* Country Code Select */}
        <Select
          value={countryCode}
          onChange={handleCountryCodeChange}
          className={styles.countryCodeSelect}
        >
<MenuItem value="050">050</MenuItem>
<MenuItem value="051">051</MenuItem>
<MenuItem value="052">052</MenuItem>
<MenuItem value="053">053</MenuItem>
<MenuItem value="054">054</MenuItem>
<MenuItem value="055">055</MenuItem>
<MenuItem value="056">056</MenuItem>
<MenuItem value="057">057</MenuItem>
<MenuItem value="058">058</MenuItem>
<MenuItem value="059">059</MenuItem>

        </Select>

        {/* Phone Number Input */}
        <TextField
  type="text"
  value={phoneNumber}
  onChange={handlePhoneNumberChange}
  placeholder="123 4567"
  className={styles.phoneNumberInput}
  inputProps={{
    maxLength: 7,
    minLength: 7,
    pattern: "[0-9]{7}",
  }}
/>

      </Box>

      {/* Terms Agreement */}
      <Typography variant="body2" className={styles.termsText}>
        בלחיצה על המשך אני מסכים <span className={styles.termsLink}>לתנאים</span>
      </Typography>
       {/* Worker Image */}
       <Box className={styles.workerImageContainer}>
        <img
          src="/images/home.png"
          alt="Worker"
          className={styles.workerImage}
        />
      </Box>

      {/* Sign-In Button */}
      <Button
        variant="contained"
        className={styles.signInButton}
        onClick={handleSignIn}
        disabled={isSending}
      >
        {isSending ? "שולח..." : "כניסה"}
      </Button>

     
    </Box>
  );
};

export default SignInPage;
