import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PC from '../../components/client/PC';
import { API_URL } from "../../utils/constans";
import { useLanguage } from '../../components/LanguageContext'; // Import the useLanguage hook
import {
    getMinDateTime,
    getMainProfessions,
    getSubProfessions,
    getDirection,
    isRtl
} from '../../utils/generalUtils';



function MainPage() {

    const [isTyping, setIsTyping] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [mainOptions, setMainOptions] = useState([]);
    const [subOptions, setSubOptions] = useState([]);
    const [main, setMain] = useState(location.state?.main || '');
    const [sub, setSub] = useState(location.state?.subP || '');
    const [locationValue, setLocationValue] = useState(localStorage.getItem('location') || '');
    const [dateAndTime, setDateAndTime] = useState(localStorage.getItem('dateAndTime') || '');
    const [searchInput, setSearchInput] = useState('');
    const { translation, language } = useLanguage(); // Access translation and language from the context
    const direction = getDirection(language);
    const rtl = isRtl(language);
    const textAlignStyle = { textAlign: direction === 'rtl' ? 'right' : 'left' };



    const [minDate, setMinDate] = useState('');
    const dateInputRef = useRef(null);
    const handleCalendarClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker();
        }
    };

    useEffect(() => {
        setMinDate(getMinDateTime());
    }, []);

    useEffect(() => {
        if (location.state?.main) {
            setMain(location.state.main);
        } else {
            setMain(localStorage.getItem('main') || '');
        }

        if (location.state?.subP) {
            setSub(location.state.subP);
        } else {
            setSub(localStorage.getItem('sub') || '');
        }
    }, [location.state]);

    // Fetch Main Professions
    useEffect(() => {
        const fetchMainProfessionsData = async () => {
            try {
                const mainProfessions = await getMainProfessions();
                setMainOptions(mainProfessions);
            } catch (error) {
                console.error('Error fetching main professions:', error);
            }
        };
        fetchMainProfessionsData();
    }, []);

    // Fetch Sub Professions based on selected Main Profession
    useEffect(() => {
        if (main) {
            const fetchSubProfessionsData = async () => {
                try {
                    const subProfessions = await getSubProfessions(main);
                    setSubOptions(subProfessions);
                } catch (error) {
                    console.error('Error fetching sub professions:', error);
                }
            };
            fetchSubProfessionsData();
        } else {
            setSubOptions([]);
            setSub('');
        }
    }, [main]);


    // Store selected values in localStorage before navigating away
    useEffect(() => {
        localStorage.setItem('main', main);
        localStorage.setItem('sub', sub);
        localStorage.setItem('location', locationValue);
        localStorage.setItem('dateAndTime', dateAndTime);


    }, [main, sub, locationValue, dateAndTime]);

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        setIsTyping(value.length > 0); // Set typing state
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (e.currentTarget.checkValidity()) {
            navigate('/information', {
                state: {
                    main,
                    sub,
                    location: locationValue,
                    dateAndTime
                }
            });
        } else {
            e.currentTarget.reportValidity();
        }
    };
    const handleLocationClick = () => {
        navigate('/location');
    };

    const handleSearch = () => {
        if (searchInput.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchInput)}`);
        }
    };

    const handleDateAndTimeChange = (e) => {
        setDateAndTime(e.target.value);
    };

    return (
        <div className="container">
            <div className="row">
                <PC />
                <div className="right-col">
                    <div className="phone-case">
                        <img src="/images/phone.png" alt="Phone Case" />
                        <div className="phone-screen">
                            <div className="main-form">
                                <h2 className="start-title" dir={direction}>{translation.startTitle}</h2>
                                <div className="search searchBtn">
                                    <input
                                        type="text"
                                        className={rtl ? 'input-rtl' : 'input-ltr'}
                                        value={searchInput}
                                        onChange={handleSearchInputChange}
                                        placeholder={translation.searchPlaceholder}
                                        style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
                                        required
                                    />
                                    <i className={`ri-search-line search-icon ${searchInput.length > 0 ? 'typing' : ''}`} onClick={handleSearch}></i>
                                </div>
    
                                <form className="mt-1 form-book" onSubmit={handleSubmit}>
                                    <div className="select_input_container">
                                        <div className="select_item">
                                            <label dir={direction} style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} htmlFor="main">
                                                {translation.selectMain}
                                            </label>
                                            <div className="custom-select-wrapper menu">
                                                <select
                                                    className="custom-select"
                                                    name="main"
                                                    style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
                                                    id="main"
                                                    value={main}
                                                    onChange={(e) => setMain(e.target.value)}
                                                    required
                                                >
                                                    <option value="">{translation.noSelection}</option>
                                                    {mainOptions.map(option => (
                                                        <option key={option.id} value={option.id}>
                                                            {option.main}
                                                        </option>
                                                    ))}
                                                </select>
                                                <i className={`ri-arrow-down-s-fill select-icon ${rtl ? 'rtl' : 'ltr'}`}></i>
                                            </div>
                                        </div>
    
                                        <div className="select_item">
                                            <label dir={direction} style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }} htmlFor="sub">
                                                {translation.selectSub}
                                            </label>
                                            <div className="custom-select-wrapper menu">
                                                <select
                                                    className="custom-select"
                                                    style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
                                                    name="sub"
                                                    id="sub"
                                                    value={sub}
                                                    onChange={(e) => setSub(e.target.value)}
                                                    required
                                                    disabled={!main}
                                                >
                                                    <option value="">{translation.noSelection}</option>
                                                    {subOptions.map(option => (
                                                        <option key={option.id} value={option.id}>
                                                            {option.sub}
                                                        </option>
                                                    ))}
                                                </select>
                                                <i className={`ri-arrow-down-s-fill select-icon ${rtl ? 'rtl' : 'ltr'}`}></i>
                                            </div>
                                        </div>
    
                                        <div className="select_item">
                                            <label dir={direction} htmlFor="location">{translation.selectLocation}</label>
                                            <div className="custom-select-wrapper menu">
                                                <input
                                                    type="text"
                                                    dir={direction}
                                                    style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
                                                    className="custom-select"
                                                    name="location"
                                                    id="location"
                                                    onClick={handleLocationClick}
                                                    value={locationValue}
                                                    placeholder={translation.locationPlaceholder}
                                                    readOnly
                                                    required
                                                />
                                            </div>
                                        </div>
    
                                        <div className="select_item">
                                            <label dir={direction} htmlFor="dateAndTime">{translation.selectDateTime}</label>
                                            <div className="custom-select-wrapper menu" onClick={handleCalendarClick}>
                                                <textarea
                                                    type="text"
                                                    name="dateAndTime"
                                                    className="calendar-date-input"
                                                    style={{ display: 'none' }}
                                                    value={dateAndTime}
                                                    readOnly
                                                    required
                                                ></textarea>
    
                                                <div className="dropdown">
                                                    <input
                                                        ref={dateInputRef}
                                                        type="datetime-local"
                                                        className="custom-select"
                                                        style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
                                                        id="dateAndTime"
                                                        value={dateAndTime}
                                                        min={minDate}
                                                        onChange={handleDateAndTimeChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
    
                                    <button type="submit" className="navigate-links btnSubmit mt-1">{translation.nextButton}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
