// src/components/professionals/AvailabilityForm.jsx
import React from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';

function AvailabilityForm({ dayAvailability, setDayAvailability, toggleAvailability }) {
    return (
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
    );
}

export default AvailabilityForm;
