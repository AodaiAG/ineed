import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Fade,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from '../../utils/clientApi'; // Assuming you've set up an API utility for axios
import styles from "../../styles/client/MyRequests.module.css";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(true);
  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/api/my_requests'); // Fetch client requests
        if (response.data.success) {
          setRequests(response.data.data); // Set fetched requests
          console.log(response.data.data);
        } else {
          console.error('Failed to fetch requests:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleScroll = () => {
    const element = listRef.current;
    if (element) {
      setShowTopIndicator(element.scrollTop > 0);
      setShowBottomIndicator(
        element.scrollHeight - element.scrollTop > element.clientHeight
      );
    }
  };

  const handleBackClick = () => {
    navigate('/dashboard'); // Navigate back to dashboard
  };

  if (loading) {
    return (
      <Box className={styles.loaderContainer}>
        <CircularProgress className={styles.loader} />
      </Box>
    );
  }

  return (
    <Box className={styles.myRequestsContainer}>
      {/* Header */}
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          הקריאות שלי
        </Typography>
      </Box>
      <Box className={styles.separator}></Box>

      {/* Scrollable List */}
      <Box
        className={styles.requestsList}
        ref={listRef}
        onScroll={handleScroll}
        style={{ position: "relative", overflowY: "auto" }}
      >
        <Fade in={showTopIndicator}>
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "20px",
              background:
                "linear-gradient(to bottom, rgba(24, 144, 255, 0.5), transparent)",
            }}
          />
        </Fade>

        {/* Request Cards */}
        {requests.map((clientRequest) => {
          const request = clientRequest; // Access request data
          const jobRequiredId = request.jobRequiredId || "N/A";
          const city = request.city || "Unknown City";
          const date = new Date(request.date).toLocaleString() || "No Date";
          const comment = request.comment || "No Comments";

          return (
            <Card key={request.id} className={styles.requestCard}>
              <Typography className={styles.requestId}>
                קריאה {request.id}
              </Typography>
              <CardContent sx={{ padding: "0 !important" }}>
                <Box className={styles.detailsContainer}>
                  <Typography variant="body1" className={styles.detailsText}>
                    <strong>Job ID:</strong> {jobRequiredId}
                  </Typography>
                  <Typography variant="body1" className={styles.detailsText}>
                    <strong>City:</strong> {city}
                  </Typography>
                  <Typography variant="body2" className={styles.dateText}>
                    <strong>Date:</strong> {date}
                  </Typography>
                  <Typography variant="body2" className={styles.commentText}>
                    <strong>Comment:</strong> {comment}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions className={styles.cardActions}>
                <Button
                  variant="contained"
                  className={`${styles.button} ${styles.detailsButton}`}
                  onClick={() => navigate(`/request?id=${request.id}`)}
                >
                  פרטי הקריאה
                </Button>
                <Button
                  variant="contained"
                  className={`${styles.button} ${styles.professionalsButton}`}
                  onClick={() => navigate(`/requests/${request.id}/professionals`)}
                >
                  רשימת המומחים
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>

      {/* Footer */}
      <Box className={styles.footer}>
        <Button
          variant="contained"
          className={styles.backButton}
          onClick={handleBackClick}
        >
          חזור
        </Button>
      </Box>
    </Box>
  );
};

export default MyRequests;
