import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Fade,
} from "@mui/material";
import styles from "../../styles/client/MyRequests.module.css";

const MyRequests = () => {
  const requests = [
    { id: 1908, dateTime: "17.05.2025 18:40", details: "אינסטלציה, התקנת ברז" },
    { id: 1270, dateTime: "17.05.2025 18:40", details: "חשמלאי, התקנת שקע" },
    { id: 3456, dateTime: "18.05.2025 10:00", details: "נגרות, הרכבת ארון" },
    { id: 4567, dateTime: "20.05.2025 12:00", details: "התקנת מדף" },
  ];

  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(true);
  const listRef = useRef(null);

  // Handle scroll event to toggle indicators
  const handleScroll = () => {
    const element = listRef.current;
    if (element) {
      setShowTopIndicator(element.scrollTop > 0);
      setShowBottomIndicator(
        element.scrollHeight - element.scrollTop > element.clientHeight
      );
    }
  };

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
        {/* Scroll Indicators */}
        <Fade in={showTopIndicator}>
  <Box
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "20px",
      background: "linear-gradient(to bottom, rgba(24, 144, 255, 0.5), transparent)", // A light blue gradient
    }}
  />
</Fade>

        

        {/* Request Cards */}
        {requests.map((request) => (
          <Card key={request.id} className={styles.requestCard}>
            <Typography className={styles.requestId}>
              קריאה {request.id}
            </Typography>
            <CardContent>
              <Typography variant="body1" className={styles.detailsText}>
                {request.details}
              </Typography>
              <Typography variant="body2" className={styles.dateText}>
                {request.dateTime}
              </Typography>
            </CardContent>
            <CardActions className={styles.cardActions}>
              <Button
                variant="contained"
                className={`${styles.button} ${styles.detailsButton}`}
              >
                פרטי הקריאה
              </Button>
              <Button
                variant="contained"
                className={`${styles.button} ${styles.professionalsButton}`}
              >
                רשימת המומחים
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Footer */}
      <Box className={styles.footer}>
        <Button variant="contained" className={styles.backButton}>
          חזור
        </Button>
      </Box>
    </Box>
  );
};

export default MyRequests;
