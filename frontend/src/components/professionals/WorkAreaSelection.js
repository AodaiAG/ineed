import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from '../../styles/ProfessionalRegistration.module.css';

const WorkAreas = forwardRef(({
    groupedLocations,

    workAreaSelections,
    setWorkAreaSelections,
    error
}, ref) => {
    const { translation } = useLanguage();
    const [searchText, setSearchText] = useState('');
    const [expandedArea, setExpandedArea] = useState(null);
    const areaToggleRefs = useRef({});

    // Effect to load initial data only once
    useEffect(() => {
        console.log("Initial workAreaSelections from server:", workAreaSelections);
    }, [workAreaSelections]);

    // Ensure selections are logged on update
    useEffect(() => {
        console.log("Updated workAreaSelections:", workAreaSelections);
    }, [workAreaSelections]);

    const handleLocationToggle = (cityId) => {
        setWorkAreaSelections(prevSelections => {
            const updatedSelections = prevSelections.includes(cityId)
                ? prevSelections.filter(id => id !== cityId)
                : [...prevSelections, cityId];
            console.log("Updated workAreaSelections after city toggle:", updatedSelections);
            return updatedSelections;
        });
    };

    const countSelectedCities = (area) => {
        return area.cities.filter(city => workAreaSelections.includes(city.cityId)).length;
    };

    const handleToggleAllChildren = (areaId, isChecked) => {
        setWorkAreaSelections(prevSelections => {
            const areaCities = groupedLocations.find(area => area.areaId === areaId)?.cities || [];
            const areaCityIds = areaCities.map(city => city.cityId);
            const updatedSelections = isChecked
                ? [...new Set([...prevSelections, ...areaCityIds])]
                : prevSelections.filter(id => !areaCityIds.includes(id));
            console.log("Updated workAreaSelections after toggle all in area:", updatedSelections);
            return updatedSelections;
        });
    };

    const handleToggleDropdown = (areaId) => {
        if (expandedArea === areaId) {
            setExpandedArea(null);
        } else {
            setExpandedArea(null);
            setTimeout(() => {
                setExpandedArea(areaId);
                if (areaToggleRefs.current[areaId]) {
                    areaToggleRefs.current[areaId].scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
    };

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
        return <div>Loading...</div>;
    }

    return (
        <div ref={ref} className={styles['pro-form-group']}>
            <label className={`${styles['pro-label']} ${styles['pro-label-required']}`}>
                {translation.workAreasLabel}
            </label>
            {error && <p className={styles['pro-error']}>{error}</p>}

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
                    const isExpanded = expandedArea === area.areaId;

                    return (
                        <div key={area.areaId} className={styles['pro-dropdown']}>
                            <div
                                ref={(el) => (areaToggleRefs.current[area.areaId] = el)}
                                className={styles['pro-dropdown-toggle']}
                                onClick={() => handleToggleDropdown(area.areaId)}
                            >
                                <label>
                                    <input 
                                        type="checkbox" 
                                        id={`${area.areaId}-checkbox`}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleToggleAllChildren(area.areaId, e.target.checked);
                                        }}
                                        checked={countSelectedCities(area) === area.cities.length && area.cities.length > 0}
                                    />
                                    <span>{area.areaName}</span>
                                </label>
                                {selectedCount > 0 && (
                                    <span className={styles['pro-badge']}>{selectedCount}</span>
                                )}
                                <i className={styles['pro-arrow']}>⌄</i>
                            </div>
                            <div 
                                className={styles['pro-dropdown-content']} 
                                id={area.areaId}
                                style={{ display: isExpanded ? 'block' : 'none' }}
                            >
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
