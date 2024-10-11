import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import ProfessionalDashboard from './pages/professionals/ProfessionalDashboard';
import ProfessionalProfile from './pages/professionals/ProfessionalProfile';
import ProfessionalRequests from './pages/professionals/ProfessionalRequests';

function App() {
    return (
        <LanguageProvider>
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/intro" element={<IntroPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/phone_verify" element={<PhoneVerifyPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/location" element={<LocationPage />} />
                <Route path="/information" element={<InfoPage />} />
                <Route path="/thankyou" element={<ThankYouPage />} />
                 {/* New Professional Routes */}
                 <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
                 <Route path="/professional/profile" element={<ProfessionalProfile />} />
                 <Route path="/professional/requests" element={<ProfessionalRequests />} />
            </Routes>
        </Router>
        </LanguageProvider>
    );
}

export default App;
