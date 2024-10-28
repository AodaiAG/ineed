import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const useUserValidation = (redirectIfValid = null, redirectIfInvalid = '/pro/enter') => {
    const navigate = useNavigate();
    const [isValidUserdata, setIsValidUserdata] = useState(null); // null indicates we're still checking
    const [decryptedUserdata, setDecryptedUserdata] = useState(null); // Store decrypted user data

    useEffect(() => {
        try {
            console.log("Checking for user data...");
            const encryptedData = localStorage.getItem('userdata');
            if (encryptedData) {
                const bytes = CryptoJS.AES.decrypt(encryptedData, 'Server!123%#%^$#@Work');
                const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                if (decryptedData && decryptedData.profId) {
                    console.log("Userdata is valid.");
                    setIsValidUserdata(true);
                    setDecryptedUserdata(decryptedData); // Store the decrypted data

                    // If a redirection route is specified when user data is valid
                    if (redirectIfValid) {
                        navigate(redirectIfValid);
                    }
                    return;
                }
            }
            // If no valid user data is found, mark it as invalid
            setIsValidUserdata(false);
        } catch (e) {
            console.error('Error during user validation:', e);
            setIsValidUserdata(false);
        }
    }, [navigate, redirectIfValid]);

    useEffect(() => {
        if (isValidUserdata === false) {
            // Redirect if user data is invalid or missing
            navigate(redirectIfInvalid);
        }
    }, [isValidUserdata, navigate, redirectIfInvalid]);

    return { isValidUserdata, decryptedUserdata };
};

export default useUserValidation;
