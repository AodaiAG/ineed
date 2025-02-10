import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../utils/clientApi";
import styles from "../../styles/client/RequestList.module.css";

const RequestList = ({ title, requestType }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const language = "he"; // Define language preference for fetching professions

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get(`/api/my_requests?type=${requestType}`);
        if (response.data.success) {
          const fetchedRequests = response.data.data;

          // Fetch professions for each request
          const updatedRequests = await Promise.all(
            fetchedRequests.map(async (request, index) => {
              try {
                const professionResponse = await api.get(
                  `/api/professionals/profession/${request.jobRequiredId}/${language}`
                );
                if (professionResponse.data.success) {
                  return {
                    ...request,
                    mainProfession: professionResponse.data.data.main,
                    subProfession: professionResponse.data.data.sub,
                    index: index + 1, // ✅ Left section number as an index (starts from 1)
                  };
                }
              } catch (error) {
                console.error("Error fetching profession:", error);
              }
              return {
                ...request,
                mainProfession: "לא ידוע",
                subProfession: "לא ידוע",
                index: index + 1, // ✅ Keep the index even if there's an error
              };
            })
          );

          setRequests(updatedRequests);
        } else {
          console.error("Failed to fetch requests:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [requestType]);

  if (loading) {
    return (
      <Box className={styles.loaderContainer}>
        <CircularProgress className={styles.loader} />
      </Box>
    );
  }

  return (
    <Box className={styles.requestListContainer}>
      {/* Header */}
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>{title}</Typography>
      </Box>

      {/* Scrollable List */}
      <Box className={styles.requestsList}>
        {requests.map((request) => (
          <React.Fragment key={request.id}>
            <Box className={styles.requestCard} onClick={() => navigate(`/request?id=${request.id}`)}>
              {/* Left Section - Index Number */}
              <Box className={styles.leftSection}>{request.index}</Box> 

              {/* Middle Section - Details */}
              <Box className={styles.middleSection}>
                {/* Request ID */}
                <Box className={styles.infoBlock}>
                  <Typography className={styles.infoLabel}>קריאה</Typography>
                  <Typography className={styles.infoValue}>{request.id}</Typography>
                </Box>

                {/* Experts */}
                <Box className={styles.infoBlock}>
                  <Typography className={styles.infoLabel}>מומחים</Typography>
                  <Typography className={styles.infoValue}>{request.experts || "N/A"}</Typography>
                </Box>

                {/* Profession & Main (No Label) */}
                <Box className={styles.professionDateContainer}>
                  <Typography className={styles.professionValue}>
                    {request.mainProfession}, {request.subProfession}
                  </Typography>
                  <Typography className={styles.dateText}>
                    {new Date(request.date).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* Right Section - Unread Messages */}
              <Box className={styles.rightSection}>
                <Box className={styles.unreadBadge}>{request.unreadMessages || 0}</Box>
              </Box>
            </Box>
            {/* Separator */}
            <Box className={styles.separator}></Box>
          </React.Fragment>
        ))}
      </Box>

      {/* Footer */}
      <Box className={styles.footer}>
        <Button
          variant="contained"
          className={styles.backButton}
          onClick={() => navigate("/dashboard")}
        >
          חזור
        </Button>
      </Box>
    </Box>
  );
};

export default RequestList;
