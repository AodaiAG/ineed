// src/pages/professionals/ProfessionalRegistration.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/ProfessionalRegistration.module.css';
import { API_URL } from '../../utils/constans';
import PersonalInfoForm from '../../components/professionals/PersonalInfoForm';
import ImageUpload from '../../components/professionals/ImageUpload';
import JobFieldsSelection from '../../components/professionals/JobFieldsSelection';

import WorkAreas from '../../components/professionals/WorkAreaSelection';
import AvailabilityTimes from '../../components/professionals/AvailabilityForm';
import LanguagePreferences from '../../components/professionals/LanguagePreferences';

function ProfessionalRegistration() {
    
    const navigate = useNavigate();
    const [availability24_7, setAvailability24_7] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mainProfessions, setMainProfessions] = useState([]);
    const [subProfessions, setSubProfessions] = useState({});
    const [selectedProfessionIds, setSelectedProfessionIds] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('he'); // Default is 'he' for Hebrew

    const [image, setImage] = useState('/images/prof/w.png');
    const [groupedLocations, setGroupedLocations] = useState([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [businessName, setBusinessName] = useState('');
    const languageMapping = {
        he: 0,
        en: 1,
        ru: 2,
        es: 3,
        ar: 4
    };
    
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
        const storedPhoneNumber = sessionStorage.getItem('professionalPhoneNumber');
        if (storedPhoneNumber) {
            setPhoneNumber(storedPhoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        }

        const fetchMainProfessions = async () => {
            try {
                const response = await axios.get(`${API_URL}/main-professions`);
                setMainProfessions(response.data);
            } catch (error) {
                console.error('Error fetching main professions:', error);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await axios.get(`${API_URL}/professionals/locations`);
                const locationsData = response.data;
                setGroupedLocations(locationsData);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchMainProfessions();
        fetchLocations();
    }, []);

    const validateForm = () => {
        if (!fullName) {
            alert('אנא הזן שם פרטי ומשפחה');
            return false;
        }

        if (!email) {
            alert('אנא הזן אימייל');
            return false;
        }

        const isAnyMainProfessionSelected = mainProfessions.some(main => document.getElementById(`${main.main}-checkbox`)?.checked);
        if (!isAnyMainProfessionSelected) {
            alert('אנא בחר לפחות תחום עיסוק אחד');
            return false;
        }

        if (workAreaSelections.length === 0) {
            alert('אנא בחר לפחות אזור עבודה אחד');
            return false;
        }

        const isAnyDayAvailable = Object.values(dayAvailability).some(day => day.isWorking);
        if (!isAnyDayAvailable) {
            alert('אנא בחר לפחות יום אחד שבו אתה זמין לעבודה');
            return false;
        }

        const isAnyLanguageSelected = Object.values(languages).some(lang => lang);
        if (!isAnyLanguageSelected) {
            alert('אנא בחר לפחות שפה אחת');
            return false;
        }

        return true;
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

        const selectedLanguages = Object.entries(languages)
            .filter(([lang, isSelected]) => isSelected)
            .map(([lang]) => lang);

        const professionalData = {
            phoneNumber,
            fullName,
            email,
            website,
            businessName,
            image,
            availability24_7,
            dayAvailability: transformDayAvailabilityForBackend(dayAvailability),
            professions: selectedProfessionIds, // Store only the IDs of selected professions
            workAreas: workAreaSelections, // Store only the IDs of selected work areas (cities)
            languages // Use numeric language IDs
        };

        console.log('Professional Data:', professionalData); // Debug data

        try {
            const response = await axios.post(`${API_URL}/professionals/register`, professionalData);
            const registeredId = response.data.id; // Assume the API returns the newly registered user's ID.
            // Store the ID in session storage
            sessionStorage.setItem('professionalId', registeredId);
            // Redirect to Expert Interface page after successful registration
            navigate('/pro/expert-interface');
        } catch (error) {
            console.error('Error saving registration:', error);
        }
    };

    return (
        <div className={styles['pro-body']}>
            <div className={styles['pro-container']}>
                <div className={styles['pro-content']}>
                    {/* Form Title */}
                    <h1 className={styles['pro-form-title']}>קצת עליך</h1>

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
                    />

                    {/* Job Fields Section */}
                    <JobFieldsSelection
                        mainProfessions={mainProfessions}
                        subProfessions={subProfessions}
                        fetchSubProfessions={(main) => {
                            // Fetch sub-professions based on the selected main profession
                            axios.get(`${API_URL}/sub-professions/${main}`)
                                .then(response => {
                                    setSubProfessions(prev => ({ ...prev, [main]: response.data }));
                                })
                                .catch(error => console.error('Error fetching sub-professions:', error));
                        }}
                        toggleDropdown={toggleDropdown}
                        toggleAllChildren={toggleAllChildren}
                        setSelectedProfessionIds={setSelectedProfessionIds}
                        selectedProfessionIds={selectedProfessionIds}
                    />
                    {/* Work Areas Section */}
                    <WorkAreas
                        groupedLocations={groupedLocations}
                        toggleDropdown={toggleDropdown}
                        toggleAllChildren={toggleAllChildren}
                        setWorkAreaSelections={setWorkAreaSelections}
                        workAreaSelections={workAreaSelections}
                    />

                    {/* Availability Times Section */}
                    <AvailabilityTimes
                        dayAvailability={dayAvailability}
                        setDayAvailability={setDayAvailability}
                        toggleAvailability={toggleAvailability}
                        language={selectedLanguage || 'he'} // Default to 'he' if no language selected
                    />

                    {/* Language Preferences Section */}
                    <LanguagePreferences languages={languages} setLanguages={setLanguages} />

                    {/* Continue Button */}
                    <button className={styles['pro-continue-button']} onClick={handleSubmit}>המשך</button>
                </div>
            </div>
        </div>
    );
}

export default ProfessionalRegistration;
