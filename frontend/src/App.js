import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext'; // Import the provider
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import OrientationHandler from './components/OrientationHandler'; // Import the OrientationHandler
import HomePage from './pages/client/HomePage';
import AppStart from './pages/client/AppStart';
import HelpForm from './pages/client/HelpForm';
import AboutForm from './pages/client/AboutForm';
import SummaryForm from './pages/client/SummaryForm';
import SMSVerificationC from './pages/client/SMSVerification';
import RequestDetailsPage from './pages/client/RequestDetailsPage';
import ClientDashboard from './pages/client/Dashboard';
import MyRequests from './pages/client/MyRequests';
import ProfessionalsList from './pages/client/ProfessionalList';
import ProfilePage from './pages/client/ProfilePage';


ProfilePage








// Professional Pages
import ProfessionalPhoneScreen from './pages/professionals/PhoneScreen';
import SMSVerification from "./pages/professionals/SMSVerification"; 
import ProfessionalRegistration from './pages/professionals/ProfessionalRegistration'; 
import ExpertInterface from './pages/professionals/ExpertInterface'; 
import BusinessCard from './pages/professionals/BusinessCard'; 
import EditProfessionalSettings from './pages/professionals/EditProfessionalSettings'; 
import ExpertMainPage from './pages/professionals/ExpertMainPage';
import ExplainScreen from './pages/professionals/ExplainScreen'; 
import RequestPage from './pages/professionals/RequestPage'; 
import ProfessionalRequestDetailsPage from './pages/professionals/ProfessionalRequestDetailsPage'; 


ProfessionalRequestDetailsPage


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
                            <Route path="/summary" element={<SummaryForm />} />
                            <Route path="/sms" element={<SMSVerificationC />} />
                            <Route path="/request" element={<RequestDetailsPage />} />
                            <Route path="/dashboard" element={<ClientDashboard />} />
                            <Route path="/dashboard/my-requests" element={<MyRequests />} />
                            <Route path="/request/:id/professionals" element={<ProfessionalsList />} />
                            <Route path="/profile/:id" element={<ProfilePage />} />



                            

                            {/* Professional Side Routes */}
                            <Route path="/pro/enter" element={<ProfessionalPhoneScreen />} />
                            <Route path="/pro/sms-verification" element={<SMSVerification />} />
                            <Route path="/pro/register" element={<ProfessionalRegistration />} />
                            <Route path="/pro/expert-interface" element={<ExpertInterface />} />
                            <Route path="/pro/bs-card" element={<BusinessCard />} />
                            <Route path="/pro/edit-settings" element={<EditProfessionalSettings />} />
                            <Route path="/pro/expert-main" element={<ExpertMainPage />} />
                            <Route path="/pro/explain" element={<ExplainScreen />} />
                            <Route path="pro/requests/new" element={<RequestPage />} />
                            <Route path="/pro/requests/:id" element={<ProfessionalRequestDetailsPage />} />
                            

                        </Routes>
                    
                </LanguageProvider>
        </Router>
    );
}

// Component to dynamically set body classes based on current route

export default App;
