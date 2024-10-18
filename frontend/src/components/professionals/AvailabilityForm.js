import React from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';
import { dayNumberToName } from '../../utils/generalUtils';

function AvailabilityForm({ dayAvailability, setDayAvailability, toggleAvailability, language = 'he' }) {
    return (
        <div className={styles['pro-form-group']}>
            <label className={styles['pro-label']}>שעות זמינות לעבודה:</label>
            <div className={styles['pro-availability-group']}>
                {Object.keys(dayAvailability).map((dayInt) => {
                    const dayName = dayNumberToName(parseInt(dayInt), language);
                    return (
                        <div key={dayInt} className={styles['day']}>
                            <input
                                type="checkbox"
                                id={`${dayInt}-checkbox`}
                                checked={dayAvailability[dayInt].isWorking}
                                onChange={() => toggleAvailability(parseInt(dayInt))}
                                className={styles['day-checkbox']}
                            />
                            <label htmlFor={`${dayInt}`} className={styles['day-label']}>{dayName}:</label>
                            <input
                                type="time"
                                id={`${dayInt}-start`}
                                className={`${styles['day-input']} ${!dayAvailability[dayInt].isWorking ? styles['disabled-input'] : ''}`}
                                value={dayAvailability[dayInt].start}
                                onChange={(e) =>
                                    setDayAvailability((prev) => ({
                                        ...prev,
                                        [dayInt]: { ...prev[dayInt], start: e.target.value }
                                    }))
                                }
                                disabled={!dayAvailability[dayInt].isWorking}
                            />
                            -
                            <input
                                type="time"
                                id={`${dayInt}-end`}
                                className={`${styles['day-input']} ${!dayAvailability[dayInt].isWorking ? styles['disabled-input'] : ''}`}
                                value={dayAvailability[dayInt].end}
                                onChange={(e) =>
                                    setDayAvailability((prev) => ({
                                        ...prev,
                                        [dayInt]: { ...prev[dayInt], end: e.target.value }
                                    }))
                                }
                                disabled={!dayAvailability[dayInt].isWorking}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AvailabilityForm;
