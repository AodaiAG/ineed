import React, { forwardRef, useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from '../../styles/ProfessionalRegistration.module.css';

const JobFieldsSelection = forwardRef(({
    mainProfessions,
    subProfessions,
    fetchSubProfessions,
    toggleDropdown,
    setSelectedProfessionIds,
    selectedProfessionIds = [],
    error // New error prop for displaying job fields selection error
}, ref) => {
    const { translation } = useLanguage();
    const [fetchedProfessions, setFetchedProfessions] = useState(new Set());

    useEffect(() => {
        mainProfessions.forEach(mainProfession => {
            if (!fetchedProfessions.has(mainProfession.main)) {
                fetchSubProfessions(mainProfession.main);
                setFetchedProfessions(prev => new Set(prev).add(mainProfession.main));
            }
        });
    }, [mainProfessions, fetchSubProfessions, fetchedProfessions]);

    // Function to toggle selection of a sub-profession by ID
    const handleSubProfessionToggle = (subProfessionId) => {
        setSelectedProfessionIds(prevIds => {
            if (prevIds.includes(subProfessionId)) {
                return prevIds.filter(id => id !== subProfessionId);
            } else {
                return [...prevIds, subProfessionId];
            }
        });
    };

    // Function to count selected sub-professions for a given main profession
    const countSelectedSubProfessions = (mainProfession) => {
        if (!subProfessions[mainProfession]) return 0;
        return subProfessions[mainProfession]?.filter(sub => selectedProfessionIds.includes(sub.id)).length || 0;
    };

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

    // Function to toggle all sub-professions when a main profession is checked/unchecked
    const handleToggleAllChildren = (mainProfession, isChecked) => {
        const subProfessionIds = subProfessions[mainProfession]?.map(sub => sub.id) || [];
        setSelectedProfessionIds(prevIds => {
            if (isChecked) {
                return [...new Set([...prevIds, ...subProfessionIds])];
            } else {
                return prevIds.filter(id => !subProfessionIds.includes(id));
            }
        });
    };

    return (
        <div ref={ref} className={styles['pro-form-group']}>
            <label className={styles['pro-label']}>{translation.selectJobFieldsLabel}</label>
            {error && <p className={styles['pro-error']}>{error}</p>} {/* Display error message above job fields selection */}
            {mainProfessions.map((mainProfession) => {
                const selectedCount = countSelectedSubProfessions(mainProfession.main);
                return (
                    <div key={mainProfession.main} className={styles['pro-dropdown']}>
                        <div
                            className={styles['pro-dropdown-toggle']}
                            onClick={(e) => {
                                // Prevent the checkbox click from triggering dropdown toggle
                                if (e.target.tagName !== "INPUT") {
                                    toggleDropdown(mainProfession.main);
                                }
                            }}
                        >
                            <label>
                                <input
                                    type="checkbox"
                                    id={`${mainProfession.main}-checkbox`}
                                    checked={countSelectedSubProfessions(mainProfession.main) === (subProfessions[mainProfession.main]?.length || 0) && subProfessions[mainProfession.main]?.length > 0}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        handleToggleAllChildren(mainProfession.main, e.target.checked);
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
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            handleSubProfessionToggle(subProfession.id);
                                        }}
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
});

export default JobFieldsSelection;
