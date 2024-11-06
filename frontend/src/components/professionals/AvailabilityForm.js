import React, { forwardRef, useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../styles/AvailabilityForm.module.css';
import { useLanguage } from '../../contexts/LanguageContext';

const AvailabilityForm = forwardRef(({ dayAvailability, setDayAvailability, error, availability24_7, setAvailability24_7 }, ref) => {
    const { translation } = useLanguage();
    const [localAvailability247, setLocalAvailability247] = useState(availability24_7);
    const [firstSelection, setFirstSelection] = useState(true);
    const [lastSelectedTime, setLastSelectedTime] = useState({ start: new Date().setHours(8, 0), end: new Date().setHours(17, 0) });
    const [openEndTimePicker, setOpenEndTimePicker] = useState({}); // State to track open state of each "To" picker

    const startInputRefs = useRef({});
    const toInputRefs = useRef({});

    useEffect(() => {
        setLocalAvailability247(availability24_7);
    }, [availability24_7]);

    const handleToggleAvailability = (dayInt) => {
        const isCurrentlyWorking = dayAvailability[dayInt].isWorking;

        setDayAvailability((prev) => ({
            ...prev,
            [dayInt]: {
                isWorking: !isCurrentlyWorking,
                start: isCurrentlyWorking ? '' : lastSelectedTime.start,
                end: isCurrentlyWorking ? '' : lastSelectedTime.end,
            }
        }));

        if (!isCurrentlyWorking) {
            if (firstSelection) {
                setFirstSelection(false);
                setTimeout(() => {
                    startInputRefs.current[dayInt]?.setFocus();
                }, 0);
            }
        } else {
            const remainingWorkingDays = Object.values(dayAvailability).filter(day => day.isWorking);
            if (remainingWorkingDays.length <= 1) {
                setFirstSelection(true);
            }
        }
    };

    const handleAvailability247Change = (checked) => {
        setLocalAvailability247(checked);
        setAvailability24_7(checked);
    };

    const handleStartTimeChange = (dayInt, value) => {
        setDayAvailability((prev) => ({
            ...prev,
            [dayInt]: { ...prev[dayInt], start: value }
        }));
        setLastSelectedTime((prev) => ({ ...prev, start: value }));
        setOpenEndTimePicker((prev) => ({ ...prev, [dayInt]: true })); // Open only this day's "To" picker
    };

    const handleEndTimeChange = (dayInt, value) => {
        setDayAvailability((prev) => ({
            ...prev,
            [dayInt]: { ...prev[dayInt], end: value }
        }));
        setLastSelectedTime((prev) => ({ ...prev, end: value }));
        setOpenEndTimePicker((prev) => ({ ...prev, [dayInt]: false })); // Close only this day's "To" picker
    };

    if (!translation) {
        return <div>Loading...</div>;
    }

    return (
        <div ref={ref} className={styles['availability-form-container']}>
            <label className={`${styles['availability-label']} ${styles['availability-label-required']}`}>
                {translation.availabilityLabel}
            </label>
            {error && <p className={styles['error-message']}>{error}</p>}
            <div className={styles['availability-group']}>
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
                    const dayName = translation.days[dayInt];
                    const isWorking = dayAvailability[dayInt].isWorking;

                    return (
                        <div key={dayInt} className={styles['day']}>
                            <div className={styles['day-checkbox-label-container']}>
                                <input
                                    type="checkbox"
                                    id={`${dayInt}-checkbox`}
                                    checked={isWorking}
                                    onChange={() => handleToggleAvailability(parseInt(dayInt))}
                                    className={styles['day-checkbox']}
                                />
                                <label htmlFor={`${dayInt}`} className={styles['day-label']}>{dayName}:</label>
                            </div>
                            <div className={styles['day-time-inputs-container']}>
                                {/* Start Time Picker */}
                                <DatePicker
                                    selected={dayAvailability[dayInt].start ? new Date(dayAvailability[dayInt].start) : null}
                                    onChange={(value) => handleStartTimeChange(parseInt(dayInt), value)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption=""
                                    dateFormat="h:mm aa"
                                    placeholderText={translation.fromPlaceholder}
                                    className={styles['day-input']}
                                    disabled={!isWorking}
                                    ref={(el) => (startInputRefs.current[dayInt] = el)}
                                />
                                <span className={styles['time-separator']}>-</span>
                                {/* End Time Picker */}
                                <DatePicker
                                    selected={dayAvailability[dayInt].end ? new Date(dayAvailability[dayInt].end) : null}
                                    onChange={(value) => handleEndTimeChange(parseInt(dayInt), value)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption=""
                                    dateFormat="h:mm aa"
                                    placeholderText={translation.toPlaceholder}
                                    className={styles['day-input']}
                                    minTime={dayAvailability[dayInt].start || lastSelectedTime.start}
                                    maxTime={new Date().setHours(23, 59)}
                                    disabled={!isWorking}
                                    open={openEndTimePicker[dayInt] || false} // Open only if this day's "To" picker is set to true
                                    onFocus={() => setOpenEndTimePicker((prev) => ({ ...prev, [dayInt]: true }))} // Open on focus for "To"
                                    onClickOutside={() => setOpenEndTimePicker((prev) => ({ ...prev, [dayInt]: false }))} // Close if clicked outside
                                    ref={(el) => (toInputRefs.current[dayInt] = el)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default AvailabilityForm;
