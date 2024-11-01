import React, { forwardRef, useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from '../../styles/ProfessionalRegistration.module.css';

const JobFieldsSelection = forwardRef(({
    domains,
    selectedDomain,
    setSelectedDomain,
    mainProfessions,
    fetchMainProfessions,
    subProfessions,
    fetchSubProfessions,
    setSelectedProfessionIds,
    selectedProfessionIds = [],
    error // Error prop for displaying job fields selection error
}, ref) => {
    const { translation } = useLanguage();
    const [expandedDomains, setExpandedDomains] = useState(new Set());
    const [expandedMains, setExpandedMains] = useState(new Set());

    console.log("Selected Profession IDs:", selectedProfessionIds);

    useEffect(() => {
        // Fetch the main professions for the selected domain if it's set
        if (selectedDomain && !mainProfessions[selectedDomain]) {
            fetchMainProfessions(selectedDomain);
        }
    }, [selectedDomain, mainProfessions, fetchMainProfessions]);

    // Function to toggle the visibility of the main professions under a domain
    const handleToggleDomain = (domain) => {
        setSelectedDomain(domain);
        
        // Expand only the clicked domain and collapse others
        setExpandedDomains(prev => {
            if (prev.has(domain)) {
                return new Set(); // Collapse the domain if already expanded
            } else {
                return new Set([domain]); // Expand the clicked domain
            }
        });

        // Fetch main professions if they haven't been fetched yet
        if (!mainProfessions[domain] || mainProfessions[domain].length === 0) {
            fetchMainProfessions(domain);
        }
    };

    // Function to toggle the visibility of sub-professions under a main profession
    const handleToggleMain = (mainProfession) => {
        setExpandedMains(prev => {
            const updated = new Set(prev);
            if (updated.has(mainProfession)) {
                updated.delete(mainProfession);
            } else {
                updated.add(mainProfession);
            }
            return updated;
        });

        // Fetch sub-professions if they haven't been fetched yet
        if (!subProfessions[mainProfession] || subProfessions[mainProfession].length === 0) {
            fetchSubProfessions(mainProfession);
        }
    };

    // Function to count selected sub-professions for a given main profession
    const countSelectedSubProfessions = (mainProfession) => {
        if (!subProfessions[mainProfession]) return 0;
        return subProfessions[mainProfession]?.filter(sub => selectedProfessionIds.includes(sub.id)).length || 0;
    };

    // Function to count selected main professions for a given domain
    const countSelectedMainProfessions = (domain) => {
        if (!mainProfessions[domain]) return 0;

        return mainProfessions[domain]?.filter(main => {
            // Check if sub-professions for the main profession are selected
            return subProfessions[main.main]?.some(sub => selectedProfessionIds.includes(sub.id)) || false;
        }).length || 0;
    };

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

            {domains.map((domain) => (
                <div key={domain.domain} className={styles['pro-dropdown']}>
                    {/* Domain Level */}
                    <div
                        className={styles['pro-dropdown-toggle']}
                        onClick={() => handleToggleDomain(domain.domain)}
                        style={{ display: 'flex', cursor: 'pointer' }}
                    >
                        <span>{domain.domain}</span>
                        {countSelectedMainProfessions(domain.domain) > 0 && (
                            <span className={styles['pro-badge']}>{countSelectedMainProfessions(domain.domain)}</span>
                        )}
                        <i className={styles['pro-arrow']}>{expandedDomains.has(domain.domain) ? '⌃' : '⌄'}</i>
                    </div>

                    <div className={styles['pro-dropdown-content']} style={{ display: expandedDomains.has(domain.domain) ? 'block' : 'none' }} id={domain.domain}>
                        {(mainProfessions[domain.domain] && mainProfessions[domain.domain].length > 0) ? (
                            mainProfessions[domain.domain].map((mainProfession, index) => {
                                const selectedCount = countSelectedSubProfessions(mainProfession.main);
                                return (
                                    <div key={`${mainProfession.main}-${index}`} className={styles['pro-dropdown']}>
                                        {/* Main Profession Level */}
                                        <div
                                            className={styles['pro-dropdown-toggle']}
                                            onClick={(e) => {
                                                if (e.target.tagName !== "INPUT") {
                                                    handleToggleMain(mainProfession.main);
                                                }
                                            }}
                                            style={{ display: 'flex', cursor: 'pointer' }}
                                        >
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    id={`${mainProfession.main}-checkbox`}
                                                    checked={
                                                        subProfessions[mainProfession.main] &&
                                                        subProfessions[mainProfession.main].every(sub => selectedProfessionIds.includes(sub.id))
                                                    }
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
                                            <i className={styles['pro-arrow']}>{expandedMains.has(mainProfession.main) ? '⌃' : '⌄'}</i>
                                        </div>

                                        <div className={styles['pro-dropdown-content']} style={{ display: expandedMains.has(mainProfession.main) ? 'block' : 'none' }} id={mainProfession.main}>
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
                            })
                        ) : (
                            <p>Loading main professions...</p> // Loading state if mainProfessions is not yet available
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
});

export default JobFieldsSelection;
