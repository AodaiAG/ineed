import React, { forwardRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from '../../styles/ProfessionalRegistration.module.css';

const WorkAreas = forwardRef(({
    groupedLocations,
    toggleDropdown,
    toggleAllChildren,
    workAreaSelections,
    setWorkAreaSelections,
    error
}, ref) => {
    const { translation } = useLanguage();
    const [searchText, setSearchText] = useState('');

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

    // Filter areas and cities based on search text
    const filteredLocations = groupedLocations.map(area => ({
        ...area,
        cities: area.cities.filter(city =>
            city.cityName?.toLowerCase().includes(searchText.toLowerCase())
        )
    })).filter(area => 
        area.areaName?.toLowerCase().includes(searchText.toLowerCase()) || 
        area.cities.length > 0
    );

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    return (
        <div ref={ref} className={styles['pro-form-group']}>
<label className={`${styles['pro-label']} ${styles['pro-label-required']}`}>
    {translation.workAreasLabel}
</label>            {error && <p className={styles['pro-error']}>{error}</p>}

            {/* Search Bar */}
            <div className={styles['search-bar-container']}>
                <input
                    type="text"
                    placeholder={translation.searchAreaOrCity}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={styles['search-bar']}
                />
            </div>

            {Array.isArray(filteredLocations) && filteredLocations.length > 0 ? (
                filteredLocations.map((area) => {
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
                <p>{translation.noWorkAreasFound}</p>
            )}
        </div>
    );
});

export default WorkAreas;
