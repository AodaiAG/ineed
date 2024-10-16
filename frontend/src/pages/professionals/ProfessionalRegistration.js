import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../../styles/ProfessionalRegistration.module.css';
import { API_URL } from '../../utils/constans';
import { useNavigate } from 'react-router-dom';

function ProfessionalRegistration() {
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
    const fileInputRef = useRef(null);

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
        
                // Remove the first item from the fetched locations
                const filteredLocations = Object.fromEntries(
                    Object.entries(locationsData).slice(1)
                );
        
                setGroupedLocations(filteredLocations);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchMainProfessions();
        fetchLocations();
    }, []);

    const fetchSubProfessions = async (main) => {
        if (!subProfessions[main]) {
            try {
                const response = await axios.get(`${API_URL}/sub-professions/${main}`);
                setSubProfessions((prevSubProfessions) => ({
                    ...prevSubProfessions,
                    [main]: response.data,
                }));
            } catch (error) {
                console.error('Error fetching sub professions:', error);
            }
        }
    };

    const toggleDropdown = (id, main) => {
        const dropdown = document.getElementById(id);
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
            if (main) {
                fetchSubProfessions(main);
            }
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
                isWorking: !prevAvailability[day].isWorking
            }
        }));
    };

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    // Create a canvas to resize the image
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set the desired dimensions (e.g., 300x200)
                    const targetWidth = 300;
                    const targetHeight = 200;

                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    // Draw the resized image onto the canvas
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                    // Convert canvas back to an image
                    const resizedImageUrl = canvas.toDataURL('image/jpeg');
                    setImage(resizedImageUrl);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle the button click to open the file input
    const handleUploadButtonClick = () => {
        fileInputRef.current.click();
    };

    // Validate form fields before submitting
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

        const isAnyWorkAreaSelected = Object.entries(groupedLocations).some(([region, locations]) => locations.some(location => document.querySelector(`.${region}-child`)?.checked));
        if (!isAnyWorkAreaSelected) {
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

    // Handle form submission to save data
    const handleSubmit = async () => {
        if (!validateForm()) return;
    
        const selectedMainProfessions = mainProfessions.filter(main => {
            const checkbox = document.getElementById(`${main.main}-checkbox`);
            return checkbox && checkbox.checked;
        });
    
        const selectedSubProfessions = Object.entries(subProfessions).reduce((acc, [main, subs]) => {
            const sanitizedMain = main.replace(/[\(\)\s]/g, "\\$&"); // Escape any special characters
            acc[main] = subs.filter(sub => {
                const childCheckbox = document.querySelector(`.${sanitizedMain}-child`);
                return childCheckbox && childCheckbox.checked;
            });
            return acc;
        }, {});
    
        const selectedWorkAreas = Object.entries(groupedLocations).reduce((acc, [region, locations]) => {
            const sanitizedRegion = region.replace(/[\(\)\s]/g, "\\$&"); // Escape any special characters
            acc[region] = locations.filter(location => {
                const childCheckbox = document.querySelector(`.${sanitizedRegion}-child`);
                return childCheckbox && childCheckbox.checked;
            });
            return acc;
        }, {});
    
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
            dayAvailability,
            mainProfessions: selectedMainProfessions,
            subProfessions: selectedSubProfessions,
            workAreas: selectedWorkAreas,
            languages: selectedLanguages,
        };
    
        try {
            await axios.post(`${API_URL}/professionals/register`, professionalData);
           
            navigate('/pro/expert-interface'); // Redirect to Expert Interface page after successful registration
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

                    {/* Name Input */}
                    <div className={styles['pro-form-group']}>
                        <label htmlFor="fullName" className={styles['pro-label']}>שם פרטי ומשפחה:</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                            placeholder="דני שובבני"
                        />
                    </div>

                    {/* Phone Input */}
                    <div className={styles['pro-form-group']}>
                        <label htmlFor="phone" className={styles['pro-label']}>טלפון:</label>
                        <input
                            type="text"
                            id="phone"
                            value={phoneNumber}
                            readOnly
                            disabled
                            className={`${styles['pro-input']} ${styles['pro-input-disabled']}`}
                        />
                        <p className={styles['pro-note']}>*להחלפת מספר צור קשר עם השירות <a href="#">כאן</a></p>
                    </div>

                    {/* Add Image Section */}
                    <div className={styles['pro-form-group']}>
                        <label className={styles['pro-label']}>הוסף תמונה</label>
                        <div className={styles['pro-image-upload']}>
                            <img src={image} alt="Professional Image" className={styles['pro-image-preview']} />
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                            <button type="button" className={styles['pro-upload-button']} onClick={handleUploadButtonClick}>
                                הוסף תמונה
                            </button>
                        </div>
                        <p className={styles['pro-note']}>*בעלי תמונה מקבלים יותר פניות</p>
                    </div>

                    {/* Email, Website, Business Name Inputs */}
                    <div className={styles['pro-form-group']}>
                        <label htmlFor="email" className={styles['pro-label']}>אימייל שלי:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                            placeholder="example@gmail.com"
                        />

                        <label htmlFor="website" className={styles['pro-label']}>האתר שלי:</label>
                        <input
                            type="text"
                            id="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                            placeholder="www.example.com"
                        />

                        <label htmlFor="businessName" className={styles['pro-label']}>שם העסק שלי:</label>
                        <input
                            type="text"
                            id="businessName"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className={`${styles['pro-input']} ${styles['pro-input-white']}`}
                            placeholder="שם העסק"
                        />
                    </div>

                    {/* Job Fields with Expandable Dropdowns */}
                    <div className={styles['pro-form-group']}>
                        <label className={styles['pro-label']}>בחר תחומי עיסוק:</label>
                        {mainProfessions.map((mainProfession) => (
                            <div key={mainProfession.main} className={styles['pro-dropdown']}>
                                <div
                                    className={styles['pro-dropdown-toggle']}
                                    onClick={() => toggleDropdown(mainProfession.main, mainProfession.main)}
                                >
                                    <label>
                                        <input type="checkbox" id={`${mainProfession.main}-checkbox`} onClick={(e) => { e.stopPropagation(); toggleAllChildren(mainProfession.main); }} />
                                        <span>{mainProfession.main}</span>
                                    </label>
                                    <i className={styles['pro-arrow']}>⌄</i>
                                </div>
                                <div className={styles['pro-dropdown-content']} id={mainProfession.main}>
                                    {subProfessions[mainProfession.main]?.map((subProfession) => (
                                        <label key={subProfession.id} className={styles['pro-sub-label']}>
                                            <input type="checkbox" className={`${mainProfession.main}-child`} /> {subProfession.sub}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Separator */}
                    <div className={styles['pro-separator']}></div>

                    {/* Work Areas with Master Checkbox and Expandable Dropdowns */}
                    <div className={styles['pro-form-group']}>
                        <label className={styles['pro-label']}>אזורי עבודה:</label>
                        {Object.keys(groupedLocations).map((region) => (
                            <div key={region} className={styles['pro-dropdown']}>
                                <div
                                    className={styles['pro-dropdown-toggle']}
                                    onClick={() => toggleDropdown(region, null)}
                                >
                                    <label>
                                        <input type="checkbox" id={`${region}-checkbox`} onClick={(e) => { e.stopPropagation(); toggleAllChildren(region); }} />
                                        <span>{region}</span>
                                    </label>
                                    <i className={styles['pro-arrow']}>⌄</i>
                                </div>
                                <div className={styles['pro-dropdown-content']} id={region}>
                                    {groupedLocations[region].map((location) => (
                                        <label key={location} className={styles['pro-sub-label']}>
                                            <input type="checkbox" className={`${region}-child`} /> {location}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Separator */}
                    <div className={styles['pro-separator']}></div>

                    {/* Availability Times */}
                    <div className={styles['pro-form-group']}>
                        <label className={styles['pro-label']}>שעות זמינות לעבודה:</label>
                        <div className={styles['pro-availability-group']}>
                            {Object.keys(dayAvailability).map((day, index) => (
                                <div key={index} className={styles['day']}>
                                    <input
                                        type="checkbox"
                                        id={`${day}-checkbox`}
                                        checked={dayAvailability[day].isWorking}
                                        onChange={() => toggleAvailability(day)}
                                        className={styles['day-checkbox']}
                                    />
                                    <label htmlFor={`${day}`} className={styles['day-label']}>{day}:</label>
                                    <input
                                        type="time"
                                        id={`${day}-start`}
                                        className={`${styles['day-input']} ${!dayAvailability[day].isWorking ? styles['disabled-input'] : ''}`}
                                        value={dayAvailability[day].start}
                                        onChange={(e) =>
                                            setDayAvailability((prev) => ({
                                                ...prev,
                                                [day]: { ...prev[day], start: e.target.value }
                                            }))
                                        }
                                        disabled={!dayAvailability[day].isWorking}
                                    />
                                    עד
                                    <input
                                        type="time"
                                        id={`${day}-end`}
                                        className={`${styles['day-input']} ${!dayAvailability[day].isWorking ? styles['disabled-input'] : ''}`}
                                        value={dayAvailability[day].end}
                                        onChange={(e) =>
                                            setDayAvailability((prev) => ({
                                                ...prev,
                                                [day]: { ...prev[day], end: e.target.value }
                                            }))
                                        }
                                        disabled={!dayAvailability[day].isWorking}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Separator */}
                    <div className={styles['pro-separator']}></div>

                    {/* Language Preferences */}
                    <div className={styles['pro-form-group']}>
                        <label className={styles['pro-label']}>השפות שלי:</label>
                        <div className={styles['pro-checkbox-group']}>
                            {Object.keys(languages).map((lang) => (
                                <label key={lang}>
                                    <input
                                        type="checkbox"
                                        checked={languages[lang]}
                                        onChange={() => setLanguages((prev) => ({ ...prev, [lang]: !prev[lang] }))}
                                    /> {lang}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button className={styles['pro-continue-button']} onClick={handleSubmit}>המשך</button>
                </div>
            </div>
        </div>
    );
}

export default ProfessionalRegistration;
