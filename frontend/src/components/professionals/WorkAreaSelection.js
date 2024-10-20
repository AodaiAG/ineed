import React, { forwardRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from '../../styles/ProfessionalRegistration.module.css';

const WorkAreaSelection = forwardRef(({
    groupedLocations,
    toggleDropdown,
    toggleAllChildren,
    workAreaSelections,
    setWorkAreaSelections,
    error
}, ref) => {
    const { translation } = useLanguage();

    // Function to toggle work area selection
    const handleLocationToggle = (cityId) => {
        setWorkAreaSelections(prevSelections => {
            if (prevSelections.includes(cityId)) {
                return prevSelections.filter(id => id !== cityId);
            } else {
                return [...prevSelections, cityId];
            }
        });
    };

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    // Function to count selected cities for a given area
    const countSelectedCities = (area) => {
        return area.cities.filter(city => workAreaSelections.includes(city.cityId)).length;
    };

    // Function to handle the selection of all children for an area
    const handleToggleAllChildren = (areaId, isChecked) => {
        setWorkAreaSelections(prevSelections => {
            const areaCities = groupedLocations.find(area => area.areaId === areaId)?.cities || [];
            const areaCityIds = areaCities.map(city => city.cityId);
            if (isChecked) {
                return [...new Set([...prevSelections, ...areaCityIds])];
            } else {
                return prevSelections.filter(id => !areaCityIds.includes(id));
            }
        });
    };

    return (
        <div ref={ref} className={styles['pro-form-group']}>
            <label className={styles['pro-label']}>{translation.workAreasLabel}</label>
            {error && <p className={styles['pro-error']}>{error}</p>} {/* Display error message above the work area selection */}

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
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleToggleAllChildren(area.areaId, e.target.checked);
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
                <p>{translation.noWorkAreasFound}</p> // Display message if groupedLocations is empty or not defined
            )}
        </div>
    );
});

export default WorkAreaSelection;
