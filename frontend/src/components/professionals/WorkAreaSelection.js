// src/components/professionals/WorkAreaSelection.jsx
import React from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';

function WorkAreaSelection({ groupedLocations, toggleDropdown, toggleAllChildren, workAreaSelections, setWorkAreaSelections }) {

    // Function to toggle work area selection
    const handleLocationToggle = (cityId) => {
        setWorkAreaSelections(prevSelections => {
            if (prevSelections.includes(cityId)) {
                // If the city is already selected, remove it
                return prevSelections.filter(id => id !== cityId);
            } else {
                // Otherwise, add it to the selections
                return [...prevSelections, cityId];
            }
        });
    };

    // Function to count selected cities for a given area
    const countSelectedCities = (area) => {
        return area.cities.filter(city => workAreaSelections.includes(city.cityId)).length;
    };

    return (
        <div className={styles['pro-form-group']}>
            <label className={styles['pro-label']}>אזורי עבודה:</label>
            {Array.isArray(groupedLocations) && groupedLocations.length > 0 ? (
                groupedLocations.map((area) => {
                    const selectedCount = countSelectedCities(area);
                    return (
                        <div key={area.areaId} className={styles['pro-dropdown']}>
                            <div
                                className={styles['pro-dropdown-toggle']}
                                onClick={() => toggleDropdown(area.areaId)}
                            >
                                <label>
                                    <input 
                                        type="checkbox" 
                                        id={`${area.areaId}-checkbox`} 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            toggleAllChildren(area.areaId); 
                                        }} 
                                    />
                                    <span>{area.areaName}</span>
                                </label>
                                {selectedCount > 0 && (
                                    <span className={styles['pro-badge']}>{selectedCount}</span>
                                )}
                                <i className={styles['pro-arrow']}>⌄</i>
                            </div>
                            <div className={styles['pro-dropdown-content']} id={area.areaId}>
                                {area.cities.map((city) => (
                                    <label key={city.cityId} className={styles['pro-sub-label']}>
                                        <input 
                                            type="checkbox" 
                                            className={`${area.areaId}-child`} 
                                            checked={workAreaSelections.includes(city.cityId)}
                                            onChange={() => handleLocationToggle(city.cityId)}
                                        /> 
                                        {city.cityName}
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>לא נמצאו אזורי עבודה</p> // Display message if groupedLocations is empty or not defined
            )}
        </div>
    );
}

export default WorkAreaSelection;