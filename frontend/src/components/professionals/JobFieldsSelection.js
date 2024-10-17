// src/components/professionals/JobFieldsSelection.jsx
import React, { useEffect, useState } from 'react';
import styles from '../../styles/ProfessionalRegistration.module.css';

function JobFieldsSelection({ 
    mainProfessions, 
    subProfessions, 
    fetchSubProfessions, 
    toggleDropdown, 
    toggleAllChildren,
    setSelectedProfessionIds,
    selectedProfessionIds = []  // Ensure selectedProfessionIds is at least an empty array
}) {
    const [fetchedProfessions, setFetchedProfessions] = useState(new Set());

    useEffect(() => {
        mainProfessions.forEach(mainProfession => {
            if (!fetchedProfessions.has(mainProfession.main)) {
                fetchSubProfessions(mainProfession.main);
                setFetchedProfessions(prev => new Set(prev).add(mainProfession.main));
            }
        });
    }, [mainProfessions]);

    // Function to toggle selection of a sub-profession by ID
    const handleSubProfessionToggle = (subProfessionId) => {
        setSelectedProfessionIds(prevIds => {
            if (prevIds.includes(subProfessionId)) {
                // Remove from selected if already exists
                return prevIds.filter(id => id !== subProfessionId);
            } else {
                // Add to selected if not exists
                return [...prevIds, subProfessionId];
            }
        });
    };

    // Function to count selected sub-professions for a given main profession
    const countSelectedSubProfessions = (mainProfession) => {
        if (!subProfessions[mainProfession]) return 0; // Return 0 if subProfessions for the main profession is undefined
        return subProfessions[mainProfession]?.filter(sub => selectedProfessionIds.includes(sub.id)).length || 0;
    };

    return (
        <div className={styles['pro-form-group']}>
            <label className={styles['pro-label']}>בחר תחומי עיסוק:</label>
            {mainProfessions.map((mainProfession) => {
                const selectedCount = countSelectedSubProfessions(mainProfession.main);
                return (
                    <div key={mainProfession.main} className={styles['pro-dropdown']}>
                        <div
                            className={styles['pro-dropdown-toggle']}
                            onClick={() => {
                                toggleDropdown(mainProfession.main);
                            }}
                        >
                            <label>
                                <input
                                    type="checkbox"
                                    id={`${mainProfession.main}-checkbox`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAllChildren(mainProfession.main);
                                    }}
                                />
                                <span>{mainProfession.main}</span>
                            </label>
                            {selectedCount > 0 && (
                                <span className={styles['pro-badge']}>{selectedCount}</span>
                            )}
                            <i className={styles['pro-arrow']}>⌄</i>
                        </div>
                        <div className={styles['pro-dropdown-content']} id={mainProfession.main}>
                            {subProfessions[mainProfession.main]?.map((subProfession) => (
                                <label key={subProfession.id} className={styles['pro-sub-label']}>
                                    <input
                                        type="checkbox"
                                        className={`${mainProfession.main}-child`}
                                        checked={selectedProfessionIds.includes(subProfession.id)}
                                        onChange={() => handleSubProfessionToggle(subProfession.id)}
                                    />
                                    {subProfession.sub}
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default JobFieldsSelection;
