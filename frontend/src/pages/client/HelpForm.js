import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import LocationComponentPopup from "../../components/professionals/LocationComponentPopup";
import "../../styles/client/HelpForm.css";
import { API_URL } from "../../utils/constans";
import { useLanguage } from '../../contexts/LanguageContext';
import { getDirection } from "../../utils/generalUtils"; // Import getDirection
import axios from "axios";

const HelpForm = () => {
  const navigate = useNavigate();
  const { translation } = useLanguage();

  const [domain, setDomain] = useState(
    JSON.parse(sessionStorage.getItem("domain")) || null
  );
  const [mainProfession, setMainProfession] = useState(
    JSON.parse(sessionStorage.getItem("mainProfession")) || null
  );
  const [city, setCity] = useState(
    sessionStorage.getItem("city") || ""
  );
  const [date, setDate] = useState(
    sessionStorage.getItem("date") || ""
  );
  const [domains, setDomains] = useState([]);
  const [mainProfessions, setMainProfessions] = useState([]);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [selectedLanguage] = useState(
    localStorage.getItem("userLanguage") || "he"
  );
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    const direction = getDirection(selectedLanguage); // Get the direction using the utility function
    document.documentElement.style.setProperty("--container-direction", direction);
  }, [selectedLanguage]);

  // Fetch domains dynamically
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/${selectedLanguage}/domains`
        );
        setDomains(response.data);
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };

    fetchDomains();
  }, [selectedLanguage]);

  // Fetch main professions dynamically when a domain is selected
  useEffect(() => {
    if (domain) {
      const fetchMainProfessions = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/${selectedLanguage}/main-professions?domain=${domain.domain}`
          );
          setMainProfessions(response.data);
        } catch (error) {
          console.error("Error fetching main professions:", error);
        }
      };

      fetchMainProfessions();
    } else {
      setMainProfessions([]); // Clear main professions if no domain is selected
    }
  }, [domain, selectedLanguage]);

  if (!translation) 
    {
    return (
        <div className={'spinner-overlay'}>
            <div className={'spinner'}></div>
        </div>
    );
   }

  const handleSubmit = () => {
    if (!domain || !mainProfession || !city || !date) {
      alert("All fields are required!");
      return;
    }

    // Save data to sessionStorage
    sessionStorage.setItem("domain", JSON.stringify(domain));
    sessionStorage.setItem("mainProfession", JSON.stringify(mainProfession));
    sessionStorage.setItem("city", city);
    sessionStorage.setItem("date", date);

    // Navigate to /about
    navigate("/about");
  };

  const handleLocationSelect = (location) => {
    setCity(location.address); // Update city with the selected address
  };

  return (
    <Box className="help-form-container">
      {/* Title */}
      <h2 className="help-form-title">{translation.helpForm.title}</h2>

      {/* Search Box */}
      <Box className="help-form-search-container">
        <TextField
          className="help-form-search"
          placeholder={translation.helpForm.searchPlaceholder}
          variant="outlined"
          size="small"
          fullWidth
          onChange={(e) => setIsTyping(e.target.value !== "")}
        />
        <Box className={`search-icon-box ${isTyping ? "is-typing" : ""}`}>
          <SearchIcon
            className="search-icon"
            sx={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Box>

      {/* Autocomplete Fields */}
      <Box className="help-form-field">
        <label>{translation.helpForm.selectDomain}</label>
        <Autocomplete
          options={domains}
          getOptionLabel={(option) => option.domain || ""}
          isOptionEqualToValue={(option, value) =>
            option.domain === value.domain
          }
          value={domain}
          onChange={(event, newValue) => setDomain(newValue)}
          openOnFocus
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={translation.helpForm.selectDomain}
              fullWidth
              className="help-form-input"
            />
          )}
        />
      </Box>

      <Box className="help-form-field">
        <label>{translation.helpForm.selectProfession}</label>
        <Autocomplete
          options={mainProfessions}
          getOptionLabel={(option) => option.main || ""}
          isOptionEqualToValue={(option, value) =>
            option.main === value.main
          }
          value={mainProfession}
          onChange={(event, newValue) => setMainProfession(newValue)}
          openOnFocus
          disabled={!domain}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={
                !domain
                  ? translation.helpForm.selectDomain
                  : translation.helpForm.selectProfession
              }
              fullWidth
              className="help-form-input"
            />
          )}
        />
      </Box>

      <Box className="help-form-field">
        <label>{translation.helpForm.selectCity}</label>
        <TextField
          value={city}
          onClick={() => setShowLocationPopup(true)}
          placeholder={translation.helpForm.selectCity}
          fullWidth
          className="help-form-input"
          inputProps={{
            readOnly: true,
            style: { cursor: "pointer" },
          }}
        />
      </Box>

      <Box className="help-form-field">
        <label>{translation.helpForm.selectDate}</label>
        <TextField
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          className="help-form-input"
          inputProps={{
            style: { textAlign: "center" },
          }}
        />
      </Box>

      {/* Submit Button */}
      <Button
        variant="contained"
        className="help-form-submit"
        onClick={handleSubmit}
        sx={{
          borderRadius: "14px",
          fontSize: "1.6rem",
        }}
      >
        {translation.helpForm.continue}
      </Button>

      {/* Location Popup */}
      {showLocationPopup && (
        <LocationComponentPopup
          onClose={() => setShowLocationPopup(false)}
          onSelect={handleLocationSelect}
          initialLocation={{ address: city }}
          theme="client" // Apply client-specific styles
        />
      )}
    </Box>
  );
};

export default HelpForm;
