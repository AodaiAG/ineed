import React from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import styles from "../../styles/client/ProfessionalList.module.css";

const ProfessionalList = () => {
    const { id } = useParams(); // Get the request ID from the route

  const professionals = [
    {
      id: 1,
      name: "אחמד פרחון עלי",
      profileImage: "/images/professional1.png",
      offer: "500₪",
      company: "שלמה אינסטלציה בע״מ",
    },
    {
      id: 2,
      name: "תרים הציע מחיר",
      profileImage: "/images/professional2.png",
      offer: "400₪",
      company: "שלמה אינסטלציה בע״מ",
    },
  ];

  return (
    <Box className={styles.professionalListContainer}>
      {/* Header */}
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          רשימת מומחים
        </Typography>
        <Typography className={styles.requestId}>קריאה {id}</Typography>
      </Box>

      {/* Request Details */}
      <Box className={styles.requestDetails}>
        <Typography className={styles.detailsText}>
          אינסטלציה, התקנת ברז
        </Typography>
        <Typography className={styles.dateText}>
          17.05.2025 18:40
        </Typography>
      </Box>

      <Divider className={styles.divider} />

      {/* Professionals List */}
      <Box className={styles.professionalsList}>
        {professionals.map((professional) => (
          <Card key={professional.id} className={styles.professionalCard}>
            <Box className={styles.offerContainer}>
              <Typography className={styles.offerText}>
                הצעה: {professional.offer}
              </Typography>
            </Box>
            <Box className={styles.profileContainer}>
              <Avatar
                src={professional.profileImage}
                alt={professional.name}
                className={styles.avatar}
              />
              <Typography className={styles.profileText}>פרופיל</Typography>
            </Box>
            <Typography className={styles.nameText}>
              {professional.name}
            </Typography>
            <Typography className={styles.companyText}>
              {professional.company}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Footer */}
      <Box className={styles.footer}>
        <Button variant="contained" className={styles.backButton}>
          חזור
        </Button>
        <Button variant="contained" className={styles.selectButton}>
          בחר
        </Button>
      </Box>
    </Box>
  );
};

export default ProfessionalList;
