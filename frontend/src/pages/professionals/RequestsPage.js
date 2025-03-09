import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import api from "../../utils/api";
import { useLanguage } from "../../contexts/LanguageContext";
import useAuthCheck from "../../hooks/useAuthCheck";
import styles from "../../styles/RequestPage.module.css";
import fetchUnreadMessages from "../../utils/fetchUnreadMessages"; // ✅ Import function
import { Modal, Box, Typography } from "@mui/material";
import { NotificationProvider } from "../../contexts/NotificationContext";


function RequestsPage({ mode, title }) {
    const [requests, setRequests] = useState([]);
    const [professions, setProfessions] = useState({});
    const [loading, setLoading] = useState(true);
    const [fetchingUnread, setFetchingUnread] = useState(false);
    const { translation } = useLanguage();
    const { user, isAuthenticated, loading: authLoading } = useAuthCheck();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
const [modalText, setModalText] = useState("");

    const language = "he"; // Default to Hebrew

    useEffect(() => {
        if (authLoading) return; // ✅ Wait for authentication

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        // ✅ Fetch Requests
        const fetchRequests = async () => {
            try {
                const response = await api.get(`/api/professionals/get-prof-requests?mode=${mode}`);
                if (response.data.success) {
                    setRequests(response.data.data);
                    fetchUnreadCounts(response.data.data); // ✅ Fetch unread messages after setting requests
                } else {
                    console.error("Failed to fetch requests");
                }
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [authLoading, isAuthenticated, mode, navigate]);

    // ✅ Fetch profession details for each request
    useEffect(() => {
        const fetchProfessions = async () => {
            for (const request of requests) {
                if (!professions[request.jobRequiredId]) {
                    try {
                        const response = await api.get(`/api/professionals/profession/${request.jobRequiredId}/${language}`);
                        if (response.data.success) {
                            setProfessions((prev) => ({
                                ...prev,
                                [request.jobRequiredId]: response.data.data,
                            }));
                        }
                    } catch (error) {
                        console.error("Error fetching profession details:", error);
                    }
                }
            }
        };

        if (requests.length > 0) {
            fetchProfessions();
        }
    }, [requests]);

    // ✅ Fetch Unread Message Counts
    const fetchUnreadCounts = async (updatedRequests) => {
        if (!user) return;
        setFetchingUnread(true);

        const userId = String(user.profId);

        const userToken = sessionStorage.getItem("profChatToken");

        console.log('here profid : '+ userId +'usertoken' + userToken
            
        )

        if (!userId || !userToken) {
            setFetchingUnread(false);
            return;
        }
        console.log('maybe here')

        try {
            const requestIds = updatedRequests.map((req) => req.id);
            const unreadCounts = await fetchUnreadMessages(userId, userToken, requestIds);

            console.table(unreadCounts);

            setRequests((prevRequests) =>
                prevRequests.map((request) => ({
                    ...request,
                    unreadMessages: unreadCounts[request.id] || 0, // ✅ Default to 0 if not found
                }))
            );
        } catch (error) {
            console.error("Error fetching unread messages:", error);
        } finally {
            setFetchingUnread(false);
        }
    };

    const handleRequestClick = (requestId) => {
        navigate(`/pro/requests/${requestId}`);
    };

    const formatDateTime = (dateTimeString) => {
        const dateObj = new Date(dateTimeString);
        const hours = dateObj.getHours().toString().padStart(2, "0");
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");
        const day = dateObj.getDate().toString().padStart(2, "0");
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObj.getFullYear();

        return `${hours}:${minutes} - ${day}/${month}/${year}`;
    };

    if (loading || !translation) {
        return (
            <div className={styles.spinnerOverlay}>
                <CircularProgress />
            </div>
        );
    }

    return (

        <NotificationProvider userId={user?.profId} userType="professional">
        <div className={styles.requestPageContainer}>
            
            <div className={styles.headerContainer}>
                <h1 className={styles.pageTitle}>{title}</h1>
            </div>

            <div className={styles.requestList}>
                {requests.length > 0 ? (
                    requests.map((request, index) => (
                        <React.Fragment key={request.id}>
                            <div
                                className={styles.requestCard}
                                onClick={() => handleRequestClick(request.id)}
                            >
                            <div className={styles.requestInfo}>
                                {/* Request ID (Keep as is) */}
                                <span className={styles.requestId}>{index + 1}</span>

                                <div className={styles.requestContent}>
                                    {/* First Flex Row: Labels */}
                                    <div className={styles.requestLabels}>
                                        <span className={styles.requestLabel}>
                                            {`${professions[request.jobRequiredId]?.main || "טוען..."}`}
                                        </span>
                                        
                                        <span className={styles.requestLabel}>מיקום</span>
                                        <span className={styles.requestLabel}>קריאה</span>
                                        {mode === "closed" && <span className={styles.requestLabel}>הצעה</span>}


                                    </div>

                                    {/* Second Flex Row: Values */}
                                    <div className={styles.requestValues}>
                                        <p className={styles.dateTime}>{formatDateTime(request.date)}</p>
                                        
                                        <span className={styles.requestValue}>{request.city}</span>
                                        <span className={styles.callNumber}>{request.id}</span>
                                        {mode === "closed" && (
        <span className={styles.requestValue}>
            {request.myQuotation ? `₪${request.myQuotation}` : "—"}
        </span>
    )}
                                    </div>
                                </div>

                                {/* Unread Messages (Keep as is) */}
                                <span className={styles.unreadMessages}>
                                    {fetchingUnread ? "..." : request.unreadMessages || 0}
                                </span>
                            </div>

                            </div>

                            {/* Separator between requests */}
                            {index < requests.length - 1 && <div className={styles.requestSeparator}></div>}
                        </React.Fragment>
                    ))
                ) : (
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%", // Ensures full height within parent
    textAlign: "center",
  }}
>
  <Typography variant="h6" color="red">
    אין בקשות
  </Typography>
</Box>
                )}
            </div>

            <p className={styles.supportMessage}>
                *ביטול או תקלה צור קשר עם השירות <a href="#">כאן</a>
            </p>

            <button onClick={() => navigate(-1)} className={styles.backButton}>
                חזור
            </button>
        </div>
        </NotificationProvider>

    );
}

export default RequestsPage;
