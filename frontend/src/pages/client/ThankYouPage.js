import React from 'react';
import { Link } from 'react-router-dom';
import PC from '../../components/client/PC'; // Importing PC component
import { useLanguage } from '../../contexts/LanguageContext'; // Import the useLanguage hook

function ThankYouPage() {
    const { translation, language } = useLanguage(); // Access translation and language from the context
    const getDirection = () => {
        if (language === 'ar' || language === 'he') return 'rtl';
        return 'ltr';
    };

    return (
        <div className="container">
            <div className="row">
                <PC /> {/* Same placement of the PC component */}
                <div className="right-col">
                    <div className="phone-case">
                        <img src="/images/phone.png" alt={translation.phoneCaseAlt} className="phone-image" />
                        <div className="phone-screen">
                            <div className="content">
                                <div className="top">
                                    <h2 className="start-title thank-you-title" dir={getDirection()}>
                                        {translation.thankYouTitle}
                                    </h2>
                                    <img src="/images/thankyou.png" alt={translation.thankYouImageAlt} className="img ty-img mt-1" />
                                </div>
                                <div className="bottom mt-1">
                                    <Link className="navigate-links" dir={getDirection()} to="/">
                                        {translation.finishLink}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThankYouPage;
