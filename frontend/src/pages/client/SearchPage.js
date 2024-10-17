import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PC from '../../components/client/PC';
import axios from 'axios';
import { API_URL } from "../../utils/constans";
import { useLanguage } from '../../components/LanguageContext'; // Import the useLanguage hook
import { getDirection, isRtl } from '../../utils/generalUtils';

function SearchPage() {

    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';  // Get the search query from the URL
    const [main, setMain] = useState(location.state?.main || '');
    const [subP, setSub] = useState(location.state?.subP || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const { translation, language } = useLanguage(); // Access translation and language from the context
    const direction = getDirection(language);
    const rtl = isRtl(language);

    // Send the query to the backend and get results
    const handleSearch = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_URL}/search?query=${query}`);
            if (response.data.success) {
                console.log('sub response: ' + response.data.jobType.sub);
                setMain(response.data.jobType.main);
                setSub(response.data.jobType.sub);
            } else {
                setError(response.data.message || 'No relevant profession found.');
            }
        } catch (err) {
            setError('Error fetching search results' + err);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Trigger search when the page loads
    useEffect(() => {
        if (query) {
            handleSearch();
        }
    }, [query]);

    // Handle form submission to confirm the selected main and sub categories
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting:', { main, subP }); // Log values before navigating
        if (main && subP) {
            navigate('/main', { state: { main, subP } });
        }
    };

    return (
        <div className="container">
            <div className="row">
                <PC />
                <div className="right-col">
                    <div className="phone-case">
                        <img src="/images/phone.png" alt={translation.phoneCaseAlt} />
                        <div className="phone-screen">
                            <div className="content search-content">
                                {loading ? (
                                    <div className="preloader-popup">
                                        <div className="preloader-content">
                                            <img
                                                src="/images/preloader.gif"
                                                alt={translation.loadingAlt}
                                                style={{ width: '50px', height: 'auto' }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="top">
                                            <h2 className="start-title" dir={direction}>
                                                {translation.searchTitle}
                                            </h2>
                                            <div className="search searchBtn">
                                                <input
                                                    type="text"
                                                    value={searchInput}
                                                    onChange={handleSearchInputChange}
                                                    placeholder={translation.searchPlaceholder}
                                                    style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
                                                />
                                                <i className="ri-search-line" onClick={handleSearch}></i>
                                            </div>
                                        </div>

                                        {error && <p className="error-message">{translation.errorMessage}</p>}

                                        {main && subP && (
                                            <div className="top">
                                                <div className="input">
                                                    <label dir={direction} htmlFor="main">{translation.mainLabel}</label>
                                                    <input
                                                        type="text"
                                                        dir={direction}
                                                        placeholder={main}
                                                        value={main}
                                                        readOnly
                                                        style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
                                                    />
                                                </div>
                                                <div className="input">
                                                    <label dir={direction} htmlFor="sub">{translation.subLabel}</label>
                                                    <input
                                                        type="text"
                                                        dir={direction}
                                                        placeholder={subP}
                                                        value={subP}
                                                        readOnly
                                                        style={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="bottom mt-1">
                                            <img
                                                src="/images/search-guy.png"
                                                alt={translation.searchGuyAlt}
                                                className="img search-img mt-h"
                                            />
                                            <input
                                                type="submit"
                                                value={translation.confirmButton}
                                                className="buttonSearch"
                                                dir={direction}
                                            />
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
