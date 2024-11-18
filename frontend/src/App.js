import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext'; // Import the provider
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import OrientationHandler from './components/OrientationHandler'; // Import the OrientationHandler
import HomePage from './pages/client/HomePage';
import AppStart from './pages/client/AppStart';
import HelpForm from './pages/client/HelpForm';
import AboutForm from './pages/client/AboutForm';



// Professional Pages
import ProfessionalPhoneScreen from './pages/professionals/PhoneScreen';
import SMSVerification from "./pages/professionals/SMSVerification"; 
import ProfessionalRegistration from './pages/professionals/ProfessionalRegistration'; 
import ExpertInterface from './pages/professionals/ExpertInterface'; 
import BusinessCard from './pages/professionals/BusinessCard'; 
import EditProfessionalSettings from './pages/professionals/EditProfessionalSettings'; 
import ExpertMainPage from './pages/professionals/ExpertMainPage';
import ExplainScreen from './pages/professionals/ExplainScreen'; 

function App() {
    return (
        <Router>
            {/* Wrap entire app with AuthProvider */}
                <LanguageProvider>
                    
                        <Routes>
                            {/* Client Side Routes */}
                            <Route path="/" element={<AppStart />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/main" element={<HelpForm />} />
                            <Route path="/about" element={<AboutForm />} />

                            {/* Professional Side Routes */}
                            <Route path="/pro/enter" element={<ProfessionalPhoneScreen />} />
                            <Route path="/pro/sms-verification" element={<SMSVerification />} />
                            <Route path="/pro/register" element={<ProfessionalRegistration />} />
                            <Route path="/pro/expert-interface" element={<ExpertInterface />} />
                            <Route path="/pro/bs-card" element={<BusinessCard />} />
                            <Route path="/pro/edit-settings" element={<EditProfessionalSettings />} />
                            <Route path="/pro/expert-main" element={<ExpertMainPage />} />
                            <Route path="/pro/explain" element={<ExplainScreen />} />
                        </Routes>
                    
                </LanguageProvider>
        </Router>
    );
}

// Component to dynamically set body classes based on current route

export default App;
