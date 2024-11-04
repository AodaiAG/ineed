import React, { forwardRef, useState, useEffect } from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';
import { useLanguage } from '../../contexts/LanguageContext';

const AvailabilityForm = forwardRef(({ dayAvailability, setDayAvailability, toggleAvailability, error, availability24_7, setAvailability24_7 }, ref) => {
    const { translation } = useLanguage();
    const [localAvailability247, setLocalAvailability247] = useState(availability24_7);

    useEffect(() => {
        // Synchronize local state with the prop
        setLocalAvailability247(availability24_7);
    }, [availability24_7]);

    const handleToggleAvailability = (dayInt) => {
        const isCurrentlyWorking = dayAvailability[dayInt].isWorking;

        if (!isCurrentlyWorking) {
            setDayAvailability((prev) => ({
                ...prev,
                [dayInt]: {
                    isWorking: true,
                    start: '00:00',
                    end: '23:59',
                }
            }));
        } else {
            setDayAvailability((prev) => ({
                ...prev,
                [dayInt]: {
                    isWorking: false,
                    start: '',
                    end: '',
                }
            }));
        }
    };

    const handleAvailability247Change = (checked) => {
        setLocalAvailability247(checked);
        setAvailability24_7(checked);  // Update the prop in the parent component
    };

    const handleStartTimeChange = (dayInt, value) => {
        setDayAvailability((prev) => ({
            ...prev,
            [dayInt]: { ...prev[dayInt], start: value, end: value > prev[dayInt].end ? '23:59' : prev[dayInt].end }
        }));
    };

    const handleEndTimeChange = (dayInt, value) => {
        const startValue = dayAvailability[dayInt].start;

        if (value > startValue) {
            setDayAvailability((prev) => ({
                ...prev,
                [dayInt]: { ...prev[dayInt], end: value }
            }));
        }
    };

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    return (
        <div ref={ref} className={styles['pro-form-group']}>
<label className={`${styles['pro-label']} ${styles['pro-label-required']}`}>
    {translation.availabilityLabel}
</label>            {error && <p className={styles['pro-error']}>{error}</p>} {/* Display error message above availability selection */}
            <div className={styles['pro-availability-group']}>
                <div className={styles['availability-24-7']}>
                    <input
                        type="checkbox"
                        id="availability24_7"
                        checked={localAvailability247}
                        onChange={(e) => handleAvailability247Change(e.target.checked)}
                        className={styles['day-checkbox']}
                    />
                    <label htmlFor="availability24_7" className={styles['day-label']}>
                        {translation.available247Label || 'Available 24/7'}
                    </label>
                </div>

                {!localAvailability247 && Object.keys(dayAvailability).map((dayInt) => {
                    const dayName = translation.days[dayInt]; // Get the translated day name

                    return (
                        <div key={dayInt} className={styles['day']}>
                            <input
                                type="checkbox"
                                id={`${dayInt}-checkbox`}
                                checked={dayAvailability[dayInt].isWorking}
                                onChange={() => handleToggleAvailability(parseInt(dayInt))}
                                className={styles['day-checkbox']}
                            />
                            <label htmlFor={`${dayInt}`} className={styles['day-label']}>{dayName}:</label>

                            {/* Start Time Input */}
                            <input
                                type={dayAvailability[dayInt].isWorking ? "time" : "text"}
                                id={`${dayInt}-start`}
                                className={`${styles['day-input']} ${!dayAvailability[dayInt].isWorking ? styles['disabled-input'] : ''}`}
                                value={dayAvailability[dayInt].isWorking ? dayAvailability[dayInt].start : ""}
                                placeholder={!dayAvailability[dayInt].isWorking ? translation.fromPlaceholder : ""}
                                onChange={(e) => handleStartTimeChange(parseInt(dayInt), e.target.value)}
                                disabled={!dayAvailability[dayInt].isWorking}
                            />
                            -

                            {/* End Time Input */}
                            <input
                                type={dayAvailability[dayInt].isWorking ? "time" : "text"}
                                id={`${dayInt}-end`}
                                className={`${styles['day-input']} ${!dayAvailability[dayInt].isWorking ? styles['disabled-input'] : ''}`}
                                value={dayAvailability[dayInt].isWorking ? dayAvailability[dayInt].end : ""}
                                placeholder={!dayAvailability[dayInt].isWorking ? translation.toPlaceholder : ""}
                                onChange={(e) => handleEndTimeChange(parseInt(dayInt), e.target.value)}
                                min={dayAvailability[dayInt].start}
                                max="23:59"
                                disabled={!dayAvailability[dayInt].isWorking}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default AvailabilityForm;
