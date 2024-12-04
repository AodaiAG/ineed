import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Button, List, ListItem, ListItemText } from '@mui/material';
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

    const handleBackClick = () => {
        navigate('/pro/expert-interface');
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
            <Button variant="contained" onClick={handleBackClick} className={styles.backButton}>
                {translation.backButtonLabel || 'חזור'}
            </Button>

            <h1 className={styles.pageTitle}>{title || translation.defaultTitle || 'בקשות'}</h1>

            {requests.length > 0 ? (
                <List className={styles.requestList}>
                    {requests.map((request) => (
                        <ListItem key={request.id} className={styles.requestItem}>
                            <ListItemText
                                primary={`${translation.status || 'סטאטוס'}: ${request.status}`}
                                secondary={`${translation.dateLabel || 'תאריך'}: ${request.date} | ${translation.requestNumber || 'מספר קריאה'}: ${request.jobRequiredId}`}
                            />
                            <Button
                                variant="contained"
                                onClick={() => navigate(`/pro/requests/${request.id}`)}
                                className={styles.detailsButton}
                            >
                                {translation.requestDetailsButton || 'פרטי הקריאה'}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <p className={styles.noRequestsMessage}>
                    {translation.noRequestsMessage || 'אין בקשות'}
                </p>
            )}
        </div>
    );
}

export default RequestsPage;
