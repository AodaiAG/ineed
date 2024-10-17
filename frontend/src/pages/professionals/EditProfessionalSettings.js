// src/pages/professionals/EditProfessionalSettings.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/constans';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/ProfessionalRegistration.module.css';
import PersonalInfoForm from '../../components/professionals/PersonalInfoForm';
import JobFieldsSelection from '../../components/professionals/JobFieldsSelection';
import AvailabilityForm from '../../components/professionals/AvailabilityForm';
import LanguagePreferences from '../../components/professionals/LanguagePreferences';

function EditProfessionalSettings() {
    const navigate = useNavigate();
    const [availability24_7, setAvailability24_7] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mainProfessions, setMainProfessions] = useState([]);
    const [subProfessions, setSubProfessions] = useState({});
    const [dayAvailability, setDayAvailability] = useState({
        א: { isWorking: false, start: '', end: '' },
        ב: { isWorking: false, start: '', end: '' },
        ג: { isWorking: false, start: '', end: '' },
        ד: { isWorking: false, start: '', end: '' },
        ה: { isWorking: false, start: '', end: '' },
        ו: { isWorking: false, start: '', end: '' },
        ש: { isWorking: false, start: '', end: '' }
    });
    const [image, setImage] = useState('/images/prof/w.png');
    const [groupedLocations, setGroupedLocations] = useState({});
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [languages, setLanguages] = useState({
        עברית: false,
        רוסית: false,
        אנגלית: false,
        ספרדית: false,
        ערבית: false
    });
    const [selectedProfessionIds, setSelectedProfessionIds] = useState([]);

    useEffect(() => {
        // Get the user ID from session storage
        const id = sessionStorage.getItem('professionalId');
        if (id) {
            fetchProfessionalData(id);
        } else {
            console.error("No user ID found in session storage");
            navigate('/pro/expert-interface');
        }

        // Fetch other necessary data
        const fetchMainProfessions = async () => {
            try {
                const response = await axios.get(`${API_URL}/main-professions`);
                setMainProfessions(response.data);
               
            } catch (error) {
                console.error('Error fetching main professions:', error);
            }
        };

        fetchMainProfessions();
    }, [navigate]);

    const fetchProfessionalData = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/professionals/prof-info/${id}`);
            const data = response.data;
    
            // Log the data to inspect the response structure
            console.log('Fetched professional data:', data);
    
            // Populate form with existing data
            setFullName(data.fname + ' ' + (data.lname || '')); // Set full name from fname and lname
            setPhoneNumber(data.phoneNumber); // Set phone number correctly
            setEmail(data.email);
            setWebsite(data.website);
            setBusinessName(data.businessName);
            setImage(data.image);
            setDayAvailability(data.dayAvailability || dayAvailability);
            setLanguages(data.languages || {
                עברית: false,
                רוסית: false,
                אנגלית: false,
                ספרדית: false,
                ערבית: false
            });
    
            // Check if `data.professions` is an array before setting state
            if (Array.isArray(data.professions)) {
                setSelectedProfessionIds(data.professions);
            } else {
                console.error("Expected `data.professions` to be an array, got:", data.professions);
            }
    
            console.log("Selected profession IDs set:", data.professions);
        } catch (error) {
            console.error('Error fetching professional data:', error);
        }
    };

    const handleSubmit = async () => {
        // Handle the submit functionality for saving edited professional settings
        const professionalData = {
            phoneNumber,
            fullName,
            email,
            website,
            businessName,
            image,
            availability24_7,
            dayAvailability,
            mainProfessions: mainProfessions.filter(main => selectedProfessionIds.includes(main.id)),
            subProfessions: selectedProfessionIds,
            workAreas: groupedLocations, // Assuming workAreas should be updated accordingly
            languages
        };

        console.log("Professional data to submit:", professionalData);

        try {
            await axios.put(`${API_URL}/professionals/update`, professionalData);
            navigate('/pro/expert-interface'); // Redirect to the interface after successful update
        } catch (error) {
            console.error('Error updating professional settings:', error);
        }
    };

    // Helper functions for toggling dropdowns and handling selections
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

    return (
        <div className={styles['pro-body']}>
            <div className={styles['pro-container']}>
                <div className={styles['pro-content']}>
                    {/* Form Title */}
                    <h1 className={styles['pro-form-title']}>ערוך את המידע שלך</h1>

                    {/* Render Reusable Components */}
                    <PersonalInfoForm
                        fullName={fullName}
                        setFullName={setFullName}
                        phoneNumber={phoneNumber}
                        email={email}
                        setEmail={setEmail}
                        website={website}
                        setWebsite={setWebsite}
                        businessName={businessName}
                        setBusinessName={setBusinessName}
                        image={image}
                        setImage={setImage}
                    />

                    <JobFieldsSelection
                        mainProfessions={mainProfessions}
                        subProfessions={subProfessions}
                        fetchSubProfessions={(main) => {
                            // Fetch sub-professions based on the selected main profession
                            axios.get(`${API_URL}/sub-professions/${main}`)
                                .then(response => {
                                    setSubProfessions(prev => ({ ...prev, [main]: response.data }));
                                    console.log("Fetched sub-professions for", main, ":", response.data);
                                })
                                .catch(error => console.error('Error fetching sub-professions:', error));
                        }}
                        toggleDropdown={toggleDropdown}
                        toggleAllChildren={toggleAllChildren}
                        setSelectedProfessionIds={setSelectedProfessionIds}
                        selectedProfessionIds={selectedProfessionIds}
                    />
                    <AvailabilityForm
                        dayAvailability={dayAvailability}
                        setDayAvailability={setDayAvailability}
                        toggleAvailability={toggleAvailability}
                    />
                    <LanguagePreferences languages={languages} setLanguages={setLanguages} />

                    {/* Submit Button */}
                    <button className={styles['pro-continue-button']} onClick={handleSubmit}>
                        שמור שינויים
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfessionalSettings;
