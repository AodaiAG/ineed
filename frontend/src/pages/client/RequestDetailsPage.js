import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

import {
    Button,
    Box,
    CircularProgress,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    Collapse
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StreamChatComponent from "../../components/client/StreamChatComponent";
import styles from "../../styles/client/RequestDetailsPage.module.css";
import useClientAuthCheck from "../../hooks/useClientAuthCheck";
import api from "../../utils/clientApi";
import { NotificationProvider } from "../../contexts/NotificationContext";
import dayjs from "dayjs";
import CancelRequestPage from "../../components/client/CancelRequestPage"; // ✅ Import CancelRequestPage


const RequestDetailsPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const requestId = searchParams.get("id");
    const [requestDetails, setRequestDetails] = useState(null);
    const [quotations, setQuotations] = useState([]);
    const [selectedProfessionalId, setSelectedProfessionalId] = useState(null);
    const [confirmedProfessionalId, setConfirmedProfessionalId] = useState(null);
    const [userToken, setUserToken] = useState(sessionStorage.getItem("clientChatToken"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profession, setProfession] = useState("לא ידוע");
    const [subProfession, setSubProfession] = useState("לא ידוע");
    const language = "he"; // Default language

    // Expandable Sections
    const [showProfessionals, setShowProfessionals] = useState(false);
    const [showChat, setShowChat] = useState(false);

    // Authentication check
    const { isAuthenticated, loading: authLoading, user } = useClientAuthCheck();
    //

    const [showCancelPopup, setShowCancelPopup] = useState(false);


    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        const fetchRequestDetails = async () => {
            try {
                const response = await api.get(`/api/request/${requestId}`);
                if (response.data.success) {
                    const request = response.data.data.request;
                    setRequestDetails(request);
                    setQuotations(response.data.data.quotations);

                    if (request.professionalId) {
                        setSelectedProfessionalId(request.professionalId);
                        setConfirmedProfessionalId(request.professionalId);
                    }

                    // Fetch profession details
                    if (request.jobRequiredId) {
                        const professionResponse = await api.get(
                            `/api/professionals/profession/${request.jobRequiredId}/${language}`
                        );
                        if (professionResponse.data.success) {
                            setProfession(professionResponse.data.data.main);
                            setSubProfession(professionResponse.data.data.sub);
                        }
                    }
                } else {
                    setError(response.data.message || "Failed to fetch request details");
                }
            } catch (error) {
                setError("An error occurred while fetching the request details");
            }
        };


        const fetchUserToken = async () => {
            if (!userToken) {
                try {
                    const response = await api.post("/api/generate-user-token", {
                        id: user.id,
                        type: "client",
                    });
                    const token = response.data.token;
                    sessionStorage.setItem("clientChatToken", token);
                    setUserToken(token);
                } catch (error) {
                    setError("Failed to initialize chat.");
                }
            }
        };

        Promise.all([fetchRequestDetails(), fetchUserToken()]).finally(() => setLoading(false));
    }, [authLoading, isAuthenticated, navigate, requestId, user, userToken]);

    const handleSelectProfessional = async () => {
        try {
            const response = await api.put("/api/request/select-professional", {
                requestId,
                professionalId: selectedProfessionalId,
            });

            if (response.data.success) {
                setConfirmedProfessionalId(selectedProfessionalId);
               

            }
        } catch (error) {
            alert("Failed to select professional.");
        }
    };

    if (authLoading || loading) {
        return (
            <Box className={styles.loadingContainer}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className={styles.errorContainer}>
                <Typography variant="h6">{error}</Typography>
                <Button variant="contained" onClick={() => navigate("/dashboard")} className={styles.backButton}>
                    חזור
                </Button>
            </Box>
        );
    }

        // ✅ Format date & time
        const formattedDate = requestDetails?.date
        ? dayjs(requestDetails.date).format("DD/MM/YYYY - hh:mm:ss A")
        : "תאריך לא ידוע";

            // ✅ Toggle the cancel popup
    const handleOpenCancelPopup = () => {
        setShowCancelPopup(true);
    };

    const handleCloseCancelPopup = () => {
        setShowCancelPopup(false);
    };

    return (
        <NotificationProvider userId={user?.id} userType="client">
            <Box className={styles.pageContainer}>
                {/* Header */}
                <Box className={styles.headerContainer}>
                    <Typography className={styles.headerTitle}>פרטי הקריאה</Typography>
                </Box>

   {/* Request Details */}
  {/* Request Details */}
<Box className={styles.requestDetailsContainer}>
    {/* Left Section (Trash Icon) */}
    <Box className={styles.y1} onClick={handleOpenCancelPopup}>
    <Box className={styles.deleteIcon}>🗑️</Box>
</Box>


    {/* Right Section (Details) */}
    <Box className={styles.y2}>
        {/* Details without Request Number */}

                {/* Request Number */}
                <Box className={styles.x2}>
    {/* Label (Top) */}
    <Typography className={styles.requestLabel}>קריאה</Typography> 

    {/* Value (Bottom) */}
    <Typography className={styles.requestNumber}>{requestId}</Typography>
</Box>


        <Box className={styles.x1}>
            <Typography className={styles.profession}>
                {profession}, {subProfession}
            </Typography>
            <Typography className={styles.dateTime}>
                {formattedDate}
            </Typography>
            <Typography className={styles.address}>
                {requestDetails?.city}
            </Typography>
        </Box>


    </Box>
</Box>



                {/* Professionals Section (Expandable) */}
                <Box className={styles.expandableHeader} onClick={() => { setShowProfessionals(!showProfessionals); setShowChat(false); }}>
                    <Typography>בעלי מקצוע שמוכנים לתת שירות</Typography>
                    {showProfessionals ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                <Collapse in={showProfessionals} className={styles.collapseContainer}>
    <Box className={styles.collapseWrapper}>
        <Box className={styles.professionalList}>
        <RadioGroup 
                    className={styles.radioGroupCustom} /* <-- Added class here */
                    value={selectedProfessionalId} 
                    onChange={(e) => setSelectedProfessionalId(e.target.value)}
                >                {quotations.length > 0 ? (
                    quotations.map((q) => (
                        <ListItem key={q.professionalId} className={styles.professionalCard}>
                            <FormControlLabel
                                value={q.professionalId}
                                control={<Radio />}
                                label={
                                    <Box display="flex" alignItems="center">
                                        <ListItemAvatar>
                                            <Avatar src={q.image} alt={q.name} />
                                        </ListItemAvatar>
                                        <ListItemText primary={q.name} secondary={`₪${q.price}`} className={styles.professionalText} />
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography className={styles.noExpertsMessage}>אין כרגע מומחים זמינים</Typography>
                )}
            </RadioGroup>
            {quotations.length > 0 && (
                <Button className={styles.selectButton} onClick={handleSelectProfessional} disabled={!selectedProfessionalId || selectedProfessionalId === confirmedProfessionalId}>
                    בחר מומחה
                </Button>
            )}
        </Box>
    </Box>
</Collapse>


                {/* Chat Section (Expandable) */}
{/* Chat Section (Expandable) */}
<Box className={styles.expandableHeader} onClick={() => { setShowChat(!showChat); setShowProfessionals(false); }}>
    <Typography>צ׳אט עם המומחים שלנו</Typography>
    {showChat ? <ExpandLessIcon /> : <ExpandMoreIcon />}
</Box>
<Collapse in={showChat} className={styles.chatCollapseContainer}>
    <Box className={styles.chatCollapseWrapper}>
        <Box className={styles.chatContainer}>
            <StreamChatComponent
                apiKey="nr6puhgsrawn"
                userToken={userToken}
                channelId={`request_${requestId}`}
                userID={user.id}
                userRole="client"
            />
        </Box>
    </Box>
</Collapse>


                {/* ✅ Cancel Request Popup Overlay */}
                {showCancelPopup && (
    <CancelRequestPage 
        open={showCancelPopup} 
        onClose={handleCloseCancelPopup} 
        requestId={requestId} // ✅ Pass the request ID
    />
)}



                {/* Back Button */}
                <Button className={styles.backButton} onClick={() => navigate("/dashboard")}>
                    חזור
                </Button>
            </Box>
        </NotificationProvider>
    );
};

export default RequestDetailsPage;
