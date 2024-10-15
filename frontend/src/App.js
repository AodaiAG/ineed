import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from './components/LanguageContext'; // Import the provider
import HomePage from './pages/client/HomePage';
import IntroPage from './pages/client/IntroPage';
import MainPage from './pages/client/MainPage';
import LocationPage from './pages/client/LocationPage';
import InfoPage from './pages/client/InfoPage';
import ThankYouPage from './pages/client/ThankYouPage';
import SearchPage from './pages/client/SearchPage';
import PhoneVerifyPage from './pages/client/VerifyPhonePage';

// Professional Pages
import ProfessionalPhoneScreen from './pages/professionals/PhoneScreen';
import SMSVerification from "./pages/professionals/SMSVerification"; // Import SMS Verification

function App() {
    return (
        <LanguageProvider>
            <Router>
                <BodyClassHandler />
                <Routes>
                    {/* Client Side Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/intro" element={<IntroPage />} />
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/phone_verify" element={<PhoneVerifyPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/location" element={<LocationPage />} />
                    <Route path="/information" element={<InfoPage />} />
                    <Route path="/thankyou" element={<ThankYouPage />} />

                    {/* Professional Side Routes */}
                    <Route path="/pro/enter" element={<ProfessionalPhoneScreen />} />
                    <Route path="/pro/sms-verification" element={<SMSVerification />} />

                    {/* Add more professional routes as you create new pages */}
                </Routes>
            </Router>
        </LanguageProvider>
    );
}

// Component to dynamically set body classes based on current route
function BodyClassHandler() {
    const location = useLocation();

    useEffect(() => {
        // Remove all existing body classes to avoid conflicts
        document.body.className = '';

        // Apply specific class based on the current path
        if (location.pathname.startsWith('/pro')) {
            document.body.classList.add('professional-body');
        } else {
            document.body.classList.add('client-body');
        }
    }, [location]);

    return null;
}

export default App;
