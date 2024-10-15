import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/ProfessionalRegistration.module.css'; // Import the scoped CSS module
import { API_URL } from '../../utils/constans'; // Import API URL from constants

function ProfessionalRegistration() {
    const [availability24_7, setAvailability24_7] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mainProfessions, setMainProfessions] = useState([]);
    const [subProfessions, setSubProfessions] = useState({}); // Object to store sub-professions for each main profession

    useEffect(() => {
        // Get the phone number from session storage
        const storedPhoneNumber = sessionStorage.getItem('professionalPhoneNumber');
        if (storedPhoneNumber) {
            setPhoneNumber(storedPhoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        }

        // Fetch main professions from the server
        const fetchMainProfessions = async () => {
            try {
                const response = await axios.get(`${API_URL}/main-professions`);
                setMainProfessions(response.data);
            } catch (error) {
                console.error('Error fetching main professions:', error);
            }
        };

        fetchMainProfessions();
    }, []);

    // Fetch sub-professions when a main profession is expanded
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

    // Toggle dropdown visibility and fetch sub-professions if needed
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

    // Toggle all children checkboxes when the parent checkbox is clicked
    const toggleAllChildren = (region) => {
        const masterCheckbox = document.getElementById(`${region}-checkbox`);
        const children = document.querySelectorAll(`.${region}-child`);
        children.forEach(child => {
            child.checked = masterCheckbox.checked;
        });
    };

    // Toggle availability inputs if 24/7 checkbox is checked
    const toggleAvailability = () => {
        setAvailability24_7(!availability24_7);
    };

    return (
        <div className={styles['pro-body']}>
            <div className={styles['pro-container']}>
                <div className={styles['pro-content']}>
                    {/* Form Title */}
                    <h1 className={styles['pro-form-title']}>קצת עליך</h1>

                    {/* Name Input */}
                    <div className={styles['pro-form-group']}>
                        <label htmlFor="name" className={styles['pro-label']}>שם פרטי ומשפחה:</label>
                        <input type="text" id="name" placeholder="דני שובבני" className={styles['pro-input']} />
                    </div>

                    {/* Phone Input */}
                    <div className={styles['pro-form-group']}>
                        <label htmlFor="phone" className={styles['pro-label']}>טלפון:</label>
                        <input
                            type="text"
                            id="phone"
                            value={phoneNumber}
                            readOnly
                            className={`${styles['pro-input']} ${styles['pro-input-readonly']}`}
                        />
                        <p className={styles['pro-note']}>*להחלפת מספר צור קשר עם השירות <a href="#">כאן</a></p>
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

                    {/* Availability Times */}
                    <div className={styles['pro-form-group']}>
                        <label className={styles['pro-label']}>שעות זמינות לעבודה:</label>
                        <div className={styles['pro-availability-group']}>
                            <label>
                                <input type="checkbox" id="availability-24-7" onClick={toggleAvailability} />
                                זמינות 24/7
                            </label>
                            <div className={styles['day-availability']} id="days-availability">
                                {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((day, index) => (
                                    <div key={index} className={styles['day']}>
                                        <label htmlFor={`${day}`} className={styles['day-label']}>{day}:</label>
                                        <input type="time" id={`${day}-start`} className={styles['day-input']} disabled={availability24_7} />
                                        עד
                                        <input type="time" id={`${day}-end`} className={styles['day-input']} disabled={availability24_7} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Add Image Section */}
                    <div className={styles['pro-form-group']}>
                        <label className={styles['pro-label']}>הוסף תמונה</label>
                        <div className={styles['pro-image-upload']}>
                            <img src="/images/prof/w.png" alt="Professional Image" />
                            <button className={styles['pro-upload-button']}>הוסף תמונה</button>
                        </div>
                        <p className={styles['pro-note']}>*בעלי תמונה מקבלים יותר פניות</p>
                    </div>

                    {/* Language Preferences */}
                    <div className={styles['pro-form-group']}>
                        <label className={styles['pro-label']}>השפות שלי:</label>
                        <div className={styles['pro-checkbox-group']}>
                            <label><input type="checkbox" /> עברית</label>
                            <label><input type="checkbox" /> רוסית</label>
                            <label><input type="checkbox" /> אנגלית</label>
                            <label><input type="checkbox" /> ספרדית</label>
                            <label><input type="checkbox" /> ערבית</label>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button className={styles['pro-continue-button']}>המשך</button>
                </div>
            </div>
        </div>
    );
}

export default ProfessionalRegistration;
