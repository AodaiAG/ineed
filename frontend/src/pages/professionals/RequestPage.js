import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Button, List, ListItem, ListItemText } from '@mui/material';
import api from '../../utils/api';
import { useLanguage } from '../../contexts/LanguageContext';
import useAuthCheck from '../../hooks/useAuthCheck';
import styles from '../../styles/RequestPage.module.css';

function RequestPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { translation } = useLanguage();
    const { user } = useAuthCheck(); // Get user info from Auth context
    const navigate = useNavigate();

    // Fetch new requests on component mount
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get('/api/professionals/new-requests'); // Fetch new requests
                if (response.data.success) {
                    setRequests(response.data.data); // Set fetched requests
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
    }, []);

    // Handle back button click
    const handleBackClick = () => {
        navigate('/pro/expert-interface');
    };

    // Handle "Claim Request" button click
    const handleClaimRequest = async (requestId) => {
        try {
            const response = await api.post('/api/professionals/requests/assign', { requestId });
            if (response.data.success) {
                alert(translation.requestClaimedMessage || 'Request claimed successfully!');
                setRequests((prevRequests) =>
                    prevRequests.filter((request) => request.id !== requestId)
                ); // Remove claimed request from the list
            } else {
                alert(translation.requestClaimFailedMessage || 'Failed to claim request.');
            }
        } catch (error) {
            console.error('Error claiming request:', error);
            alert(translation.requestClaimErrorMessage || 'Error claiming the request.');
        }
    };


    if (loading || !translation ) {
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

            <h1 className={styles.pageTitle}>{translation.newRequestsTitle || 'קריאות חדשות'}</h1>

            {requests.length > 0 ? (
                <List className={styles.requestList}>
                    {requests.map((request) => (
                        <ListItem key={request.id} className={styles.requestItem}>
                            <ListItemText
                                primary={`${translation.clientName || 'סטאטוס'}: ${request.status}`}
                                secondary={`${translation.dateLabel || 'תאריך'}: ${request.date} | ${translation.requestNumber || 'מספר קריאה'}: ${request.jobRequiredId}`}
                                />
                            <Button
                                variant="contained"
                                onClick={() => handleClaimRequest(request.id)}
                                className={styles.claimButton}
                            >
                                {translation.claimRequestButton || 'תפוס קריאה'}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <p className={styles.noRequestsMessage}>
                    {translation.noRequestsMessage || 'אין קריאות חדשות'}
                </p>
            )}
        </div>
    );
}

export default RequestPage;
