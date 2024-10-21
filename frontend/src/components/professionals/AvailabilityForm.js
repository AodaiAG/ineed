import React, { forwardRef } from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';
import { useLanguage } from '../../contexts/LanguageContext';

const AvailabilityForm = forwardRef(({ dayAvailability, setDayAvailability, toggleAvailability, error }, ref) => {
    const { translation } = useLanguage();

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    const handleToggleAvailability = (dayInt) => {
        const isCurrentlyWorking = dayAvailability[dayInt].isWorking;

        if (!isCurrentlyWorking) {
            // If the user selects the day to work, set default times to 00:00 - 23:59
            setDayAvailability((prev) => ({
                ...prev,
                [dayInt]: {
                    isWorking: true,
                    start: '00:00',
                    end: '23:59',
                }
            }));
        } else {
            // If the user deselects the day, reset times and disable the input
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

    const handleStartTimeChange = (dayInt, value) => {
        // When the start time is changed, ensure the end time stays within the valid range (before 23:59)
        setDayAvailability((prev) => ({
            ...prev,
            [dayInt]: { ...prev[dayInt], start: value, end: value > prev[dayInt].end ? '23:59' : prev[dayInt].end }
        }));
    };

    const handleEndTimeChange = (dayInt, value) => {
        const startValue = dayAvailability[dayInt].start;

        // Ensure the end time is later than the start time
        if (value > startValue) {
            setDayAvailability((prev) => ({
                ...prev,
                [dayInt]: { ...prev[dayInt], end: value }
            }));
        }
    };

    return (
        <div ref={ref} className={styles['pro-form-group']}>
            <label className={styles['pro-label']}>{translation.availabilityLabel}</label>
            {error && <p className={styles['pro-error']}>{error}</p>} {/* Display error message above availability selection */}
            <div className={styles['pro-availability-group']}>
                {Object.keys(dayAvailability).map((dayInt) => {
                    const dayName = translation.days[dayInt]; // Get the translated day name
                    const startValue = dayAvailability[dayInt].start;

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
                            <input
                                type="time"
                                id={`${dayInt}-start`}
                                className={`${styles['day-input']} ${!dayAvailability[dayInt].isWorking ? styles['disabled-input'] : ''}`}
                                value={dayAvailability[dayInt].start}
                                onChange={(e) => handleStartTimeChange(parseInt(dayInt), e.target.value)}
                                disabled={!dayAvailability[dayInt].isWorking}
                            />
                            -
                            <input
                                type="time"
                                id={`${dayInt}-end`}
                                className={`${styles['day-input']} ${!dayAvailability[dayInt].isWorking ? styles['disabled-input'] : ''}`}
                                value={dayAvailability[dayInt].end}
                                onChange={(e) => handleEndTimeChange(parseInt(dayInt), e.target.value)}
                                min={startValue} // End time cannot be earlier than start time
                                max="23:59" // Maximum possible end time in a day is 23:59
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