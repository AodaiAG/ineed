import React, { useState } from "react";
import { useParams } from "react-router-dom"; // ✅ Import useParams
import { Box, Typography, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import styles from "../../styles/client/RatingPage.module.css"; // Import CSS

const RatingPage = () => {
  const { id } = useParams(); // ✅ Get the request ID from the URL
  const [ratings, setRatings] = useState({
    quality: 0,
    professionalism: 0,
    price: 0,
  });

  const handleRating = (category, value) => {
    setRatings({ ...ratings, [category]: value });
  };

  return (
    <Box className={styles.pageContainer}>
      {/* Header */}
      <Box className={styles.header}>
        <Typography className={styles.headerTitle}>הקריאה הסתיימה</Typography>
        <Box className={styles.requestNumberContainer}>
          <Typography className={styles.requestLabel}>קריאה</Typography>
          <Typography className={styles.requestNumber}>{id}</Typography> {/* ✅ Dynamic Request ID */}
        </Box>
      </Box>

      {/* Rating Sections */}
      {["quality", "professionalism", "price"].map((category, index) => (
        <Box key={index} className={styles.ratingSection}>
          <Typography className={styles.ratingLabel}>
            {category === "quality"
              ? "איכות"
              : category === "professionalism"
              ? "מקצועיות"
              : "מחיר"}
          </Typography>
          <Box
            className={`${styles.ratingContainer} ${
              category === "price" ? styles.whiteBackground : ""
            }`}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <StarIcon
                key={value}
                className={`${styles.star} ${
                  value <= ratings[category] ? styles.selectedStar : ""
                }`}
                onClick={() => handleRating(category, value)}
              />
            ))}
          </Box>
        </Box>
      ))}

      {/* Submit Button */}
      <Button className={styles.submitButton}>שליחה</Button>
    </Box>
  );
};

export default RatingPage;
