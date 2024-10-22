import React from 'react';
import ReactDOM from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext'; // Import useLanguage hook
import styles from '../../styles/LocationComponentPopup.module.css'; // Ensure the path is correct

function LocationComponentPopup({ onClose, onSelect }) {
  const { translation } = useLanguage(); // Use the translation object from context

  if (!translation) {
    return <div>Loading...</div>; // Wait for translations to load
  }

  const handleSelectLocation = () => {
    const selectedLocation = 'Example Location'; // Example location value
    onSelect(selectedLocation); // Pass selected location to parent
  };

  return ReactDOM.createPortal(
    <div className={styles['popupOverlay']}>
      <div className={styles['location-container']}>
        <h2 className={styles['location-title']}>{translation.location.selectLocation}</h2>
        <label className={styles['location-label']}>{translation.location.enterLocation}</label>
        <input
          type="text"
          className={styles['location-input']}
          placeholder={translation.location.locationPlaceholder}
          onFocus={(e) => e.target.placeholder = ""} // Clear placeholder on focus
          onBlur={(e) => e.target.placeholder = translation.location.locationPlaceholder} // Set placeholder back on blur
        />
        <button className={styles['location-find-button']} onClick={handleSelectLocation}>
          <img
            src="/images/location_icon.png"
            alt={translation.location.locationIconAlt}
            className={styles['location-button-icon']}
          />
          {translation.location.findMe}
        </button>
        <div className={styles['location-map-container']}>
          <img
            src="images/map_placeholder.png"
            alt={translation.location.mapLocationAlt}
            className={styles['location-map-image']}
          />
        </div>
        <button className={styles['location-continue-button']} onClick={handleSelectLocation}>
          {translation.location.continue}
        </button>
      </div>
    </div>,
    document.body // Append to body to ensure it is rendered as an overlay
  );
}

export default LocationComponentPopup;
