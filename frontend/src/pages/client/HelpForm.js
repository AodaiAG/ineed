import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/client/HelpForm.css"; // Custom CSS for styling

const HelpForm = () => {
  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const categories = ["חשמל", "אינסטלציה", "נגרות"];
  const topics = ["התקנת שקע", "תיקון קצר", "תכנון מערכות"];
  const cities = ["תל אביב", "ירושלים", "חיפה", "באר שבע"];

  const handleSubmit = () => {
    console.log({ category, topic, city, date });
  };

  return (
    <Box className="help-form-container">
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="search-icon" />
              </InputAdornment>
            ),
          }}
        />
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
        <Autocomplete
          options={cities}
          value={city}
          onChange={(event, newValue) => setCity(newValue)}
          openOnFocus
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="בחר עיר"
              fullWidth
              className="help-form-input"
            />
          )}
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
    </Box>
  );
};

export default HelpForm;
