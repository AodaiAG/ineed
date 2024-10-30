import React, { forwardRef, useState,useEffect } from 'react';
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
    useEffect(() => {
        // Log translation to see if `fromPlaceholder` and `toPlaceholder` are present
        console.log("Translation object:", translation.fromPlaceholder);
    }, [translation]);

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

    return (
        <div ref={ref} className={styles['pro-form-group']}>
            <label className={styles['pro-label']}>{translation.availabilityLabel}</label>
            {error && <p className={styles['pro-error']}>{error}</p>} {/* Display error message above availability selection */}
            <div className={styles['pro-availability-group']}>
                {Object.keys(dayAvailability).map((dayInt) => {
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
                                placeholder={!dayAvailability[dayInt].isWorking ? translation.fromPlaceholder : "fff"}
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
                                placeholder={!dayAvailability[dayInt].isWorking ? translation.toPlaceholder : "sss"}
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
