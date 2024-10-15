import React, { useState } from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css'; // Assuming this CSS is scoped

function ProfessionalRegistration() {
    const [isAvailable24_7, setIsAvailable24_7] = useState(false);
    const [selectedWorkFields, setSelectedWorkFields] = useState({});
    const [availability, setAvailability] = useState({});
    
    const toggleDropdown = (id) => {
        setSelectedWorkFields(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleAllChildren = (region) => {
        const isChecked = !selectedWorkFields[region];
        setSelectedWorkFields(prev => ({
            ...prev,
            [region]: isChecked
        }));
    };

    const toggleAvailability = () => {
        setIsAvailable24_7(!isAvailable24_7);
    };

    return (
        <div className={styles['pro-registration-container']}>
            <div className={styles['pro-registration-content']}>
                {/* Title */}
                <h1 className={styles['pro-form-title']}>קצת עליך</h1>

                {/* Name Input */}
                <div className={styles['pro-form-group']}>
                    <label htmlFor="name" className={styles['pro-label']}>שם פרטי ומשפחה:</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="דני שובבני"
                        className={styles['pro-input-text']}
                    />
                </div>

                {/* Phone Input */}
                <div className={styles['pro-form-group']}>
                    <label htmlFor="phone" className={styles['pro-label']}>טלפון:</label>
                    <input
                        type="text"
                        id="phone"
                        value="054-123-4567"
                        readOnly
                        className={`${styles['pro-input-text']} ${styles['pro-input-readonly']}`}
                    />
                    <p className={styles['pro-note']}>
                        *להחלפת מספר צור קשר עם השירות <a href="#">כאן</a>
                    </p>
                </div>

                {/* Job Fields Checkbox with Expandable Dropdowns */}
                <div className={styles['pro-form-group']}>
                    <label className={styles['pro-label']}>בחר תחומי עיסוק:</label>

                    <div className={styles['pro-dropdown']}>
                        <div className={styles['pro-dropdown-toggle']}>
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => toggleAllChildren('carpentry')}
                                    checked={selectedWorkFields['carpentry'] || false}
                                />
                                <span>נגרות</span>
                            </label>
                            <i
                                className={styles['pro-arrow']}
                                onClick={() => toggleDropdown('carpentry')}
                            >⌄</i>
                        </div>
                        {selectedWorkFields['carpentry'] && (
                            <div className={styles['pro-dropdown-content']}>
                                <label>
                                    <input type="checkbox" />
                                    התקנת ארונות
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    תיקון ארונות
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    MDF
                                </label>
                            </div>
                        )}
                    </div>

                    <div className={styles['pro-dropdown']}>
                        <div className={styles['pro-dropdown-toggle']}>
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => toggleAllChildren('plumbing')}
                                    checked={selectedWorkFields['plumbing'] || false}
                                />
                                <span>אינסטלציה</span>
                            </label>
                            <i
                                className={styles['pro-arrow']}
                                onClick={() => toggleDropdown('plumbing')}
                            >⌄</i>
                        </div>
                        {selectedWorkFields['plumbing'] && (
                            <div className={styles['pro-dropdown-content']}>
                                <label>
                                    <input type="checkbox" />
                                    תיקון סתימות
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Availability Times */}
                <div className={styles['pro-form-group']}>
                    <label className={styles['pro-label']}>שעות זמינות לעבודה:</label>
                    <div className={styles['pro-availability-group']}>
                        <label>
                            <input
                                type="checkbox"
                                id="availability-24-7"
                                onChange={toggleAvailability}
                                checked={isAvailable24_7}
                            />
                            זמינות 24/7
                        </label>

                        {!isAvailable24_7 && (
                            <div className={styles['pro-day-availability']} id="days-availability">
                                {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day, idx) => (
                                    <div key={idx} className={styles['pro-day']}>
                                        <label htmlFor={`${day}-start`} className={styles['pro-label']}>{day}:</label>
                                        <input type="time" id={`${day}-start`} className={styles['pro-day-input']} />
                                        עד
                                        <input type="time" id={`${day}-end`} className={styles['pro-day-input']} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Image Section */}
                <div className={styles['pro-form-group']}>
                    <label className={styles['pro-label']}>הוסף תמונה</label>
                    <div className={styles['pro-image-upload']}>
                        <img src="/images/prof/worker.png" alt="Professional Image" />
                        <button className={styles['pro-upload-button']}>הוסף תמונה</button>
                    </div>
                    <p className={styles['pro-note']}>*בעלי תמונה מקבלים יותר פניות</p>
                </div>

                {/* Language Preferences */}
                <div className={styles['pro-form-group']}>
                    <label className={styles['pro-label']}>השפות שלי:</label>
                    <div className={styles['pro-checkbox-group']}>
                        {['עברית', 'רוסית', 'אנגלית', 'ספרדית', 'ערבית'].map((lang, idx) => (
                            <label key={idx}>
                                <input type="checkbox" />
                                {lang}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Continue Button */}
                <button className={styles['pro-continue-button']}>המשך</button>
            </div>
        </div>
    );
}

export default ProfessionalRegistration;
