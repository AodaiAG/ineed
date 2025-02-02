import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import api from '../../utils/api';
import { useLanguage } from '../../contexts/LanguageContext';
import useAuthCheck from '../../hooks/useAuthCheck';
import styles from '../../styles/RequestPage.module.css';

function RequestsPage({ mode, title }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { translation } = useLanguage();
    const { user } = useAuthCheck();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get(`/api/professionals/get-prof-requests?mode=${mode}`);
                if (response.data.success) {
                    setRequests(response.data.data);
                } else {
                    console.error('Failed to fetch requests');
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [mode]);

    const handleRequestClick = (requestId) => {
        navigate(`/pro/requests/${requestId}`);
    };

    if (loading || !translation) {
        return (
            <div className={styles.spinnerOverlay}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className={styles.requestPageContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.pageTitle}>קריאות חדשות</h1>
            </div>

            <div className={styles.requestList}>
                {requests.length > 0 ? (
                    requests.map((request, index) => (
                        <React.Fragment key={request.id}>
                            <div 
                                className={styles.requestCard} 
                                onClick={() => handleRequestClick(request.id)} // Clickable request
                            >
                                <div className={styles.requestInfo}>
                                    <span className={styles.requestId}>{index + 1}</span>
                                    <div className={styles.requestDetails}>
                                        <p className={styles.profession}>{request.profession}, {request.subProfession}</p>
                                        <p className={styles.dateTime}>{request.date} - {request.time}</p>
                                    </div>
                                    <div className={styles.locationInfo}>
                                        <span>מיקום</span>
                                        <span>{request.city}</span>
                                    </div>
                                    <div className={styles.callInfo}>
                                        <span>קריאה</span>
                                        <span className={styles.callNumber}>{request.id}</span>
                                    </div>
                                    <span className={styles.unreadMessages}>{request.unreadMessages}</span>
                                </div>
                            </div>

                            {/* Separator between requests */}
                            {index < requests.length - 1 && <div className={styles.requestSeparator}></div>}
                        </React.Fragment>
                    ))
                ) : (
                    <p className={styles.noRequestsMessage}>אין בקשות</p>
                )}
            </div>

            <p className={styles.supportMessage}>
                *ביטול או תקלה צור קשר עם השירות <a href="#">כאן</a>
            </p>

            <button onClick={() => navigate('/pro/expert-interface')} className={styles.backButton}>
                חזור
            </button>
        </div>
    );
}

export default RequestsPage;
