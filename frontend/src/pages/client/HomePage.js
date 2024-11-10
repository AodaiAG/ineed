import React, { useEffect, useState  } from 'react';
import PC from '../../components/client/PC';
import { Link } from 'react-router-dom';
import translations from '../../utils/translations.json';
import { useLanguage } from '../../contexts/LanguageContext'; // Import the useLanguage hook
import { useNavigate } from 'react-router-dom'; // Correct import


function HomePage() {


    const navigate = useNavigate();
    useEffect(() => {
        // Redirect to "/pro/expert-main" when the app loads
        navigate('/pro/expert-main');
    }, [navigate]);

    const { translation, language } = useLanguage(); // Access translation and language from the context
    const getDirection = () => {
        if (language === 'ar' || language === 'he') return 'rtl';
        return 'ltr';
    };
    if (!translation) {
        return <div>Loading...</div>; // Wait for translations to load
    }
    return (
        <div className="container">
            <div className="row">
                <PC />
                <div className="right-col">
                    <div className="phone-case">
                        <img src="/images/phone.png" alt="Phone Case" />
                        <div className="phone-screen">
                            <div className="content">
                                <div className="top">
                                    <h2 className="start-title">I-Need</h2>
                                    <p dir={getDirection()} className="start-subtitle">{translation.homeSubtitle}</p>
                                    <img className="img img-90" src="/images/home.png" alt="" />
                                </div>
                                <div className="bottom">
                                    <Link className='navigate-links' to='/intro'>{translation.continue}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
