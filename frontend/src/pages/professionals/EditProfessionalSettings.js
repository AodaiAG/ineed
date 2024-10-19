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
import WorkAreaSelection from '../../components/professionals/WorkAreaSelection';
import { useLanguage } from '../../contexts/LanguageContext';


function EditProfessionalSettings() {
    const { translation } = useLanguage();

    const navigate = useNavigate();
    const [availability24_7, setAvailability24_7] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('he'); // Default is 'he' for Hebrew

    const [phoneNumber, setPhoneNumber] = useState('');
    const [mainProfessions, setMainProfessions] = useState([]);
    const [subProfessions, setSubProfessions] = useState({});
    const [dayAvailability, setDayAvailability] = useState({
        0: { isWorking: false, start: '', end: '' },  // Sunday
        1: { isWorking: false, start: '', end: '' },  // Monday
        2: { isWorking: false, start: '', end: '' },  // Tuesday
        3: { isWorking: false, start: '', end: '' },  // Wednesday
        4: { isWorking: false, start: '', end: '' },  // Thursday
        5: { isWorking: false, start: '', end: '' },  // Friday
        6: { isWorking: false, start: '', end: '' }   // Saturday
    });
    const [image, setImage] = useState('/images/Prof/w.png');
    const [groupedLocations, setGroupedLocations] = useState([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [languages, setLanguages] = useState([]);

    const [selectedProfessionIds, setSelectedProfessionIds] = useState([]);
    const [workAreaSelections, setWorkAreaSelections] = useState([]);


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

        const fetchLocations = async () => {
            try {
                const response = await axios.get(`${API_URL}/professionals/locations`);
                const locationsData = response.data;
        
                // Assuming response.data is already in the correct format
                setGroupedLocations(locationsData);
                console.log("Fetched grouped locations:", locationsData);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        

        fetchMainProfessions();
        fetchLocations();
    }, [navigate]);

    const fetchProfessionalData = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/professionals/prof-info/${id}`);
            const data = response.data;

            // Log the data to inspect the response structure
            

            // Populate form with existing data
            setFullName(data.fname + ' ' + (data.lname || '')); // Set full name from fname and lname
            setPhoneNumber(data.phoneNumber); // Set phone number correctly
            setEmail(data.email);
            setWebsite(data.website);
            setBusinessName(data.businessName);
            setImage(data.image);
            setDayAvailability(data.dayAvailability || dayAvailability);
            setWorkAreaSelections(data.workAreas || []);
            console.log('Fetched work areas:', data.workAreas);

            setLanguages(data.languages || []); // Assuming `data.languages` is an array of language IDs


            // Check if `data.professions` is an array before setting state
            if (Array.isArray(data.professions)) {
                setSelectedProfessionIds(data.professions);
            } else {
                console.error("Expected `data.professions` to be an array, got:", data.professions);
            }

            
        } catch (error) {
            console.error('Error fetching professional data:', error);
        }
    };
    const transformDayAvailabilityForBackend = (dayAvailability) => {
        return Object.entries(dayAvailability).map(([dayInt, data]) => ({
            day: parseInt(dayInt), // Numeric day value (0-6)
            isWorking: data.isWorking,
            start: data.start,
            end: data.end
        }));
    };

    const handleSubmit = async () => {
        // Get the user ID from session storage
        const professionalId = sessionStorage.getItem('professionalId');
    
        if (!professionalId) {
            console.error("No user ID found in session storage");
            return;
        }
    
        const professionalData = {
            professionalId,  // Include the professional ID to know which user to update
            phoneNumber,
            fullName,
            email,
            website,
            businessName,
            image,
            availability24_7,
            dayAvailability: transformDayAvailabilityForBackend(dayAvailability),
            mainProfessions: mainProfessions.filter(main => selectedProfessionIds.includes(main.id)),
            subProfessions: selectedProfessionIds,
            workAreas: workAreaSelections,
            languages
        };
    
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
    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    return (
        <div className={styles['pro-body']}>
            <div className={styles['pro-container']}>
                <div className={styles['pro-content']}>
                    {/* Form Title */}
                    <h1 className={styles['pro-form-title']}>{translation.editTitle}</h1>

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
                                })
                                .catch(error => console.error('Error fetching sub-professions:', error));
                        }}
                        toggleDropdown={toggleDropdown}
                        toggleAllChildren={toggleAllChildren}
                        setSelectedProfessionIds={setSelectedProfessionIds}
                        selectedProfessionIds={selectedProfessionIds}
                    />

                    <WorkAreaSelection
                        groupedLocations={groupedLocations}
                        toggleDropdown={toggleDropdown}
                        toggleAllChildren={toggleAllChildren} // <-- Pass toggleAllChildren here

                        setWorkAreaSelections={setWorkAreaSelections}
                        workAreaSelections={workAreaSelections}
                    />

                    <AvailabilityForm
                        dayAvailability={dayAvailability}
                        setDayAvailability={setDayAvailability}
                        toggleAvailability={toggleAvailability}
                        language={selectedLanguage || 'he'} // Default to 'he' if no language selected
                    />
                <LanguagePreferences languages={languages} setLanguages={setLanguages} selectedLanguage={selectedLanguage || 'he'} />

                    {/* Submit Button */}
                    <button className={styles['pro-continue-button']} onClick={handleSubmit}>
                        {translation.saveChangesButton}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfessionalSettings;
