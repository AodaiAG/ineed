// src/pages/professionals/ProfessionalRegistration.jsx
import React, { useState, useEffect,useRef  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/ProfessionalRegistration.module.css';
import { API_URL } from '../../utils/constans';
import PersonalInfoForm from '../../components/professionals/PersonalInfoForm';
import ImageUpload from '../../components/professionals/ImageUpload';
import JobFieldsSelection from '../../components/professionals/JobFieldsSelection';
import { sendSms ,shortenUrl} from '../../utils/generalUtils';
import WorkAreas from '../../components/professionals/WorkAreaSelection';
import AvailabilityTimes from '../../components/professionals/AvailabilityForm';
import LanguagePreferences from '../../components/professionals/LanguagePreferences';
import { useLanguage } from '../../contexts/LanguageContext';
import Cookies from 'js-cookie'; // Import js-cookie

import { getDirection } from "../../utils/generalUtils"; // Import getDirection
import useUserValidation from '../../hooks/useUserValidation';
import CryptoJS from 'crypto-js';
function ProfessionalRegistration() {
    
    const navigate = useNavigate();
    const { isValidUserdata, decryptedUserdata } = useUserValidation(null, null); 
    const [availability24_7, setAvailability24_7] = useState(false);
    const { translation } = useLanguage(); // Use translation from context
    const [location, setLocation] = useState({
        address: '',
        lat: null,
        lon: null,
      });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [domains, setDomains] = useState([]); // Add this line to define the domains state
    const [selectedProfessionIds, setSelectedProfessionIds] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        return localStorage.getItem('userLanguage') || 'he';
    });
    const [image, setImage] = useState('/images/Prof/w.png');
    const [groupedLocations, setGroupedLocations] = useState([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [businessName, setBusinessName] = useState('');
 
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        website: '',
        jobFields: '',
        workArea: '',
        dayAvailability: '',
        language: '',
        location:''
    });

    // Refs for each field to scroll to them when needed
    const fullNameRef = useRef(null);
    const emailRef = useRef(null);
    const websiteRef = useRef(null);
    const jobFieldsRef = useRef(null);
    const workAreaRef = useRef(null);
    const dayAvailabilityRef = useRef(null);
    const languageRef = useRef(null);
    const locationRef = useRef(null); // New ref for the location input


    
    // Updated state to store selected language IDs
    const [languages, setLanguages] = useState([]);
    const [dayAvailability, setDayAvailability] = useState({
        0: { isWorking: false, start: '', end: '' },  // Sunday
        1: { isWorking: false, start: '', end: '' },  // Monday
        2: { isWorking: false, start: '', end: '' },  // Tuesday
        3: { isWorking: false, start: '', end: '' },  // Wednesday
        4: { isWorking: false, start: '', end: '' },  // Thursday
        5: { isWorking: false, start: '', end: '' },  // Friday
        6: { isWorking: false, start: '', end: '' }   // Saturday
    });
    const [workAreaSelections, setWorkAreaSelections] = useState([]);

    const toggleDropdown = (id) => {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
    };
    const toggleAllChildren = (region) => {
        const masterCheckbox = document.getElementById(`${region}-checkbox`);
        const children = document.querySelectorAll(`.${region}-child`);
        children.forEach(child => {
            child.checked = masterCheckbox.checked;
        });
    };

    const toggleAvailability = (day) => {
        setDayAvailability((prevAvailability) => ({
            ...prevAvailability,
            [day]: {
                ...prevAvailability[day],
                isWorking: !prevAvailability[day].isWorking,
            },
        }));
    };
    useEffect(() => {
        if (decryptedUserdata && decryptedUserdata.registered) {
            console.log("User is already registered. Redirecting to expert interface...");
            navigate('/pro/expert-interface');
        }
    }, [decryptedUserdata, navigate]);
            
    const fetchDomains = async () => {
        try {
            const response = await axios.get(`${API_URL}/${selectedLanguage}/domains`);
            setDomains(response.data);
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    };


    useEffect(() => {
        // Fetch the phone number from session storage
        const storedPhoneNumber = sessionStorage.getItem('professionalPhoneNumber');
        if (storedPhoneNumber) {
            setPhoneNumber(storedPhoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        }
        fetchDomains();
        // Function to fetch locations
        const fetchLocations = async () => {
            try {
                const response = await axios.get(`${API_URL}/professionals/locations?lang=${selectedLanguage}`);
                let locationsData = response.data;
                setGroupedLocations(locationsData);
                console.log("Fetched locations:", response.data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
    
        // Fetch domains and locations initially
        fetchLocations();
       
    }, [selectedLanguage]); // Dependency array to re-run effect when selectedLanguage changes
    
    // New useEffect to fetch main professions whenever selectedDomain changes


    
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!fullName) {
            newErrors.fullName = translation.fullNameError || 'Please enter your full name.';
            isValid = false;
            fullNameRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            newErrors.email = translation.emailError || 'Please enter a valid email address.';
            if (isValid) {
                emailRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            isValid = false;
        }

        const websiteRegex = /^$|^[^\s]+\.[^\s]+$/;
        if (website && !websiteRegex.test(website)) {
            newErrors.website = translation.websiteError || 'Please enter a valid website (e.g., example.com) or leave it empty.';
            if (isValid) {
                websiteRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            isValid = false;
        }

        if (selectedProfessionIds.length === 0) {
            newErrors.jobFields = translation.jobFieldsError || 'Please select at least one job field.';
            if (isValid && jobFieldsRef && jobFieldsRef.current) {
                jobFieldsRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            isValid = false;
        }

        if (workAreaSelections.length === 0) {
            newErrors.workArea = translation.workAreaError || 'Please select at least one work area.';
            if (isValid && workAreaRef && workAreaRef.current) {
                workAreaRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            isValid = false;
        }

        const isAnyDayAvailable = availability24_7 || Object.values(dayAvailability).some(day => day.isWorking);
        if (!isAnyDayAvailable) {
            newErrors.dayAvailability = translation.dayAvailabilityError || 'Please select at least one day you are available or choose Available 24/7.';
            if (isValid) {
                dayAvailabilityRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            isValid = false;
        }

        const isAnyLanguageSelected = Object.values(languages).some(lang => lang);
        if (!isAnyLanguageSelected) {
            newErrors.language = translation.languageError || 'Please select at least one language.';
            if (isValid) {
                languageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            isValid = false;
        }
        if (!location.address) {
            newErrors.location = translation.location.locationError || 'Please enter your location.';
            if (isValid) {
                locationRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            isValid = false;
        }

        setErrors(newErrors);

        return isValid;
    };
    const transformDayAvailabilityForBackend = (dayAvailability) => {
        return Object.entries(dayAvailability).map(([dayInt, data]) => ({
            day: parseInt(dayInt), // Numeric day value (0-6)
            isWorking: data.isWorking,
            start: data.start,
            end: data.end
        }));
    };
    

    // Handle form submission to save data
    const handleSubmit = async () => {
        if (!validateForm()) return;
    
        const formattedPhoneNumber = phoneNumber.replace(/-/g, '');
    console.log('selected professions '+selectedProfessionIds )
        const professionalData = {
            phoneNumber: formattedPhoneNumber, // Use formatted phone number without dashes
            fullName,
            email,
            website,
            businessName,
            image,
            availability24_7,
            dayAvailability: transformDayAvailabilityForBackend(dayAvailability),
            professions: selectedProfessionIds, // Store only the IDs of selected professions
            workAreas: workAreaSelections, // Store only the IDs of selected work areas (cities)
            languages, // Use numeric language IDs
            location, // Add the location JSON object
        };
    
        try {
            const response = await axios.post(`${API_URL}/professionals/register`, professionalData);
            const registeredId = response.data.id; // Assume the API returns the newly registered user's ID.
    
            // Retrieve existing encrypted data from localStorage
            const existingEncryptedData = localStorage.getItem('userdata');
            let updatedProfessionalData;
    
            if (existingEncryptedData)
                 {
                try {
                    // Decrypt the existing data
                    const bytes = CryptoJS.AES.decrypt(existingEncryptedData, 'Server!123%#%^$#@Work');
                    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                    
                    // Update the professional data with new ID
                    updatedProfessionalData = { ...decryptedData, ...professionalData, profId: registeredId };
                } catch (e) {
                    console.error('Error decrypting professional data:', e);
                    updatedProfessionalData = { ...professionalData, profId: registeredId }; // Fallback if decryption fails
                }
            } else {
                updatedProfessionalData = { ...professionalData, profId: registeredId };
            }
    
            // Encrypt the updated professional data and save it in localStorage
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(updatedProfessionalData), 'Server!123%#%^$#@Work').toString();
            localStorage.setItem('userdata', encryptedData);
    
            // Redirect to Expert Interface page after successful registration
            const businessCardLink = `https://ineed.vercel.app/pro/bs-card?id=${registeredId}`;
            const shortenedLink = await shortenUrl(businessCardLink);
            console.log('shortenedLink' + shortenedLink);
            let message = translation.businessCardSMS.replace("{link}", shortenedLink);
            sendSms(formattedPhoneNumber, message);
    
            navigate('/pro/expert-interface');
        } catch (error) {
            console.error('Error saving registration:', error);
        }
    };
    

    return (
        <div className={styles['pro-body']}>
            <div className={styles['pro-container']}
             style={{ direction: getDirection(selectedLanguage) }}
            >
                <div className={styles['pro-content']}>
                    {/* Form Title */}
                    <h1 className={styles['pro-form-title']}>{translation?.aboutYouLabel}</h1>

                    {/* Personal Information */}
                    <PersonalInfoForm
                        fullName={fullName}
                        setFullName={setFullName}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        email={email}
                        setEmail={setEmail}
                        website={website}
                        setWebsite={setWebsite}
                        businessName={businessName}
                        setBusinessName={setBusinessName}
                        image={image}
                        setImage={setImage}
                        location={location} // Pass location to PersonalInfoForm
                        setLocation={setLocation} // Pass setLocation to PersonalInfoForm

                        errors={errors} // Pass error messages to PersonalInfoForm
                        refs={{ fullNameRef, emailRef, websiteRef, jobFieldsRef, workAreaRef, dayAvailabilityRef, languageRef,locationRef }} // Pass refs to PersonalInfoForm
                    />
                        <div className={styles["pro-separator"]}></div>

                    {/* Job Fields Section */}
                    <JobFieldsSelection
                      domains={domains}
                      selectedProfessionIds={selectedProfessionIds}
                      setSelectedProfessionIds={setSelectedProfessionIds}
                      error={errors.jobFields}
                      refs={{ jobFieldsRef }}
                    />
                                            <div className={styles["pro-separator"]}></div>

                    {/* Work Areas Section */}
                    <WorkAreas
                        groupedLocations={groupedLocations}
                        toggleDropdown={toggleDropdown}
                        toggleAllChildren={toggleAllChildren}
                        setWorkAreaSelections={setWorkAreaSelections}
                        workAreaSelections={workAreaSelections}
                        error={errors.workArea} // Pass the work area error message
                        ref={workAreaRef} // Attach the ref to this component

                    />
                        <div className={styles["pro-separator"]}></div>

                    {/* Availability Times Section */}
                    <AvailabilityTimes
                        availability24_7={availability24_7}
                        setAvailability24_7={setAvailability24_7}  // Pass setAvailability24_7 here

                        dayAvailability={dayAvailability}
                        setDayAvailability={setDayAvailability}
                        toggleAvailability={toggleAvailability}
                        language={selectedLanguage || 'he'} // Default to 'he' if no language selected
                        error={errors.dayAvailability}
                        ref={dayAvailabilityRef}
                    />
                        <div className={styles["pro-separator"]}></div>

                    {/* Language Preferences Section */}
                    <LanguagePreferences
                      languages={languages}
                      setLanguages={setLanguages}
                      error={errors.language}
                      ref={languageRef} // Attach the ref here
                       />

                    {/* Continue Button */}
                    <button className={styles['pro-continue-button']} onClick={handleSubmit}>{translation?.continueLabel || 'המשך'}</button>
                </div>
            </div>
        </div>
    );
}

export default ProfessionalRegistration;
