import React, { useState,useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationComponentPopup from "../../components/professionals/LocationComponentPopup"; // Import the location component
import "../../styles/client/HelpForm.css"; // Custom CSS for styling
import { getDirection } from "../../utils/generalUtils"; // Import getDirection


const HelpForm = () => {
  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('userLanguage') || 'he';
});

  const categories = ["חשמל", "אינסטלציה", "נגרות"];
  const topics = ["התקנת שקע", "תיקון קצר", "תכנון מערכות"];
  useEffect(() => {
    const direction = getDirection(selectedLanguage); // Get the direction using the utility function
    document.documentElement.style.setProperty("--container-direction", direction);
  }, [selectedLanguage]);


  const handleSubmit = () => {
    console.log({ category, topic, city, date });
  };

  const handleLocationSelect = (location) => {
    setCity(location.address); // Update city with the selected address
  };

  return (
    <Box className="help-form-container"
    >
      {/* Title */}
      <h2 className="help-form-title">במה אפשר לעזור?</h2>

      {/* Search Box */}
      <Box className="help-form-search-container">
 
  <TextField
    className="help-form-search"
    placeholder="חיפוש..."
    variant="outlined"
    size="small"
    fullWidth

  />
   <Box className="search-icon-box">
    <SearchIcon className="search-icon "
    sx={{
      width: "100%", // Set width explicitly
      height: "100%", // Set height explicitly
    }}
     />
  </Box>
</Box>




      {/* Autocomplete Fields */}
      <Box className="help-form-field">
        <label>בחר תחום</label>
        <Autocomplete
          options={categories}
          value={category}
          onChange={(event, newValue) => setCategory(newValue)}
          openOnFocus
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="בחר תחום"
              fullWidth
              className="help-form-input"
            />
          )}
        />
      </Box>

      <Box className="help-form-field">
        <label>בחר נושא</label>
        <Autocomplete
          options={topics}
          value={topic}
          onChange={(event, newValue) => setTopic(newValue)}
          openOnFocus
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="בחר נושא"
              fullWidth
              className="help-form-input"
            />
          )}
        />
      </Box>

      <Box className="help-form-field">
        <label>בחר עיר</label>
        <TextField
          value={city}
          onClick={() => setShowLocationPopup(true)} // Open the location popup
          placeholder="בחר עיר"
          fullWidth
          className="help-form-input"
          inputProps={{
            readOnly: true, // Make the field readonly
            style: { cursor: "pointer" }, // Change cursor to indicate it's clickable
          }}
        />
      </Box>

      <Box className="help-form-field">
        <label>בחר זמן</label>
        <TextField
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          className="help-form-input"
          inputProps={{
            style: { textAlign: "center" }, // Center align both placeholder and text
          }}
        />
      </Box>

      {/* Submit Button */}
      <Button
        variant="contained"
        className="help-form-submit"
        onClick={handleSubmit}
        sx={{
          borderRadius: "14px", // Apply border-radius
          fontSize: "1.6rem", // Medium font size
          
        }}
      >
        המשך
      </Button>

      {/* Location Popup */}
      {showLocationPopup && (
        <LocationComponentPopup
          onClose={() => setShowLocationPopup(false)} // Close the popup
          onSelect={handleLocationSelect} // Handle location selection
          initialLocation={{ address: city }} // Pass current city as initial location
        />
      )}
    </Box>
  );
};

export default HelpForm;
