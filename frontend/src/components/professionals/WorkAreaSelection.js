// src/components/professionals/WorkAreaSelection.jsx
import React from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';

function WorkAreaSelection({ groupedLocations, toggleDropdown, toggleAllChildren }) {
    return (
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
    );
}

export default WorkAreaSelection;
