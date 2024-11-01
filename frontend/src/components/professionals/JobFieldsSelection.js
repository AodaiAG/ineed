import React, { forwardRef, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/constans';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from '../../styles/ProfessionalRegistration.module.css';

const JobFieldsSelection = forwardRef(({
    domains,
    selectedProfessionIds = [],
    setSelectedProfessionIds,
    error, // Error prop for displaying job fields selection error
    refs // Refs for scrolling to specific fields
}, ref) => {
    const { translation } = useLanguage();
    const [expandedDomains, setExpandedDomains] = useState(new Set());
    const [expandedMains, setExpandedMains] = useState(new Set());
    const [mainProfessions, setMainProfessions] = useState({});
    const [subProfessions, setSubProfessions] = useState({});
    const [loadingMainProfessions, setLoadingMainProfessions] = useState({});
    const [loadingSubProfessions, setLoadingSubProfessions] = useState({});

    // Fetch main professions for a given domain
    const fetchMainProfessions = async (domain) => {
        if (!domain || mainProfessions[domain]) {
            return;
        }
        setLoadingMainProfessions(prev => ({ ...prev, [domain]: true })); // Set loading state for main professions of this domain
        try {
            const response = await axios.get(`${API_URL}/${translation.language}/main-professions?domain=${domain}`);
            const data = response.data;

            console.log("Fetched main professions data:", data);

            if (Array.isArray(data)) {
                setMainProfessions(prev => ({ ...prev, [domain]: data }));
                // Fetch sub-professions for each main profession in this domain
                data.forEach(main => {
                    fetchSubProfessions(main.main);
                });
            } else {
                console.error('Expected an array but received:', data);
            }
        } catch (error) {
            console.error('Error fetching main professions:', error);
        } finally {
            setLoadingMainProfessions(prev => ({ ...prev, [domain]: false })); // Clear loading state for this domain
        }
    };

    // Fetch sub-professions for a given main profession
    const fetchSubProfessions = async (main) => {
        if (!main || subProfessions[main]) {
            return;
        }
        setLoadingSubProfessions(prev => ({ ...prev, [main]: true })); // Set loading state for sub-professions of this main profession
        try {
            const response = await axios.get(`${API_URL}/${translation.language}/sub-professions/${main}`);
            const data = response.data;

            console.log("Fetched sub-professions data:", data);

            if (Array.isArray(data)) {
                setSubProfessions(prev => ({ ...prev, [main]: data }));
            } else {
                console.error('Expected an array but received:', data);
            }
        } catch (error) {
            console.error('Error fetching sub-professions:', error);
        } finally {
            setLoadingSubProfessions(prev => ({ ...prev, [main]: false })); // Clear loading state for this main profession
        }
    };

    // Fetch all domains data on component mount
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await Promise.all(domains.map(async (domain) => {
                    await fetchMainProfessions(domain.domain);
                }));
            } catch (error) {
                console.error('Error fetching all data:', error);
            }
        };
        fetchAllData();
    }, [domains]);

    // Function to toggle the visibility of the main professions under a domain
    const handleToggleDomain = (domain) => {
        setExpandedDomains(prev => {
            const updated = new Set(prev);
            if (updated.has(domain)) {
                updated.delete(domain);
            } else {
                updated.add(domain);
                fetchMainProfessions(domain);
            }
            return updated;
        });
    };

    // Function to toggle the visibility of sub-professions under a main profession
    const handleToggleMain = (mainProfession) => {
        setExpandedMains(prev => {
            const updated = new Set(prev);
            if (updated.has(mainProfession)) {
                updated.delete(mainProfession);
            } else {
                updated.add(mainProfession);
                fetchSubProfessions(mainProfession);
            }
            return updated;
        });
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

    // Calculate the badge count for a domain (number of main professions with at least one selected sub-profession)
    const getDomainBadgeCount = (domain) => {
        if (!mainProfessions[domain]) {
            return 0;
        }

        return mainProfessions[domain].reduce((count, main) => {
            if (Array.isArray(subProfessions[main.main]) && subProfessions[main.main].some(sub => selectedProfessionIds.includes(sub.id))) {
                return count + 1;
            }
            return count;
        }, 0);
    };

    // Calculate the badge count for a main profession (number of selected sub-professions under this main)
    const getMainBadgeCount = (mainProfession) => {
        if (!Array.isArray(subProfessions[mainProfession])) {
            return 0;
        }

        return subProfessions[mainProfession].filter(sub => selectedProfessionIds.includes(sub.id)).length;
    };

    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }

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
                        {getDomainBadgeCount(domain.domain) > 0 && (
                            <span className={styles['pro-badge']}>
                                {getDomainBadgeCount(domain.domain)}
                            </span>
                        )}
                        <i className={styles['pro-arrow']}>{expandedDomains.has(domain.domain) ? '⌃' : '⌄'}</i>
                    </div>

                    <div className={styles['pro-dropdown-content']} style={{ display: expandedDomains.has(domain.domain) ? 'block' : 'none' }} id={domain.domain}>
                        {(loadingMainProfessions[domain.domain] || !(Array.isArray(mainProfessions[domain.domain]) && mainProfessions[domain.domain].length > 0)) ? (
                            <p>Loading main professions...</p> // Loading state if mainProfessions is not yet available
                        ) : (
                            mainProfessions[domain.domain].map((mainProfession, index) => {
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
                                                        Array.isArray(subProfessions[mainProfession.main]) &&
                                                        subProfessions[mainProfession.main].every(sub => selectedProfessionIds.includes(sub.id))
                                                    }
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        const isChecked = e.target.checked;
                                                        const subProfessionIds = Array.isArray(subProfessions[mainProfession.main]) ? subProfessions[mainProfession.main].map(sub => sub.id) : [];
                                                        setSelectedProfessionIds(prevIds => {
                                                            if (isChecked) {
                                                                return [...new Set([...prevIds, ...subProfessionIds])];
                                                            } else {
                                                                return prevIds.filter(id => !subProfessionIds.includes(id));
                                                            }
                                                        });
                                                    }}
                                                />
                                                <span>{mainProfession.main}</span>
                                            </label>
                                            {getMainBadgeCount(mainProfession.main) > 0 && (
                                                <span className={styles['pro-badge']}>
                                                    {getMainBadgeCount(mainProfession.main)}
                                                </span>
                                            )}
                                            <i className={styles['pro-arrow']}>{expandedMains.has(mainProfession.main) ? '⌃' : '⌄'}</i>
                                        </div>

                                        <div className={styles['pro-dropdown-content']} style={{ display: expandedMains.has(mainProfession.main) ? 'block' : 'none' }} id={mainProfession.main}>
                                            {loadingSubProfessions[mainProfession.main] ? (
                                                <p>Loading sub-professions...</p> // Loading state for sub-professions
                                            ) : (
                                                Array.isArray(subProfessions[mainProfession.main]) && subProfessions[mainProfession.main]?.map((subProfession) => (
                                                    <label key={subProfession.id} className={styles['pro-sub-label']}>
                                                        <input
                                                            type="checkbox"
                                                            className={`${mainProfession.main}-child`}
                                                            checked={selectedProfessionIds.includes(subProfession.id) || false}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleSubProfessionToggle(subProfession.id);
                                                            }}
                                                        />
                                                        {subProfession.sub}
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
});

export default JobFieldsSelection;
