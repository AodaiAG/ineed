import React from 'react';
import { useLanguage } from '../contexts/LanguageContext'; // Import useLanguage hook
import styles from '../styles/LocationComponentPopup.module.css';

function LocationComponentPopup() {
  const { translation } = useLanguage(); // Use the translation object from context

  if (!translation) {
    return <div>Loading...</div>; // Wait for translations to load
  }

  return (
    <div className={styles['location-container']}>
      <h2 className={styles['location-title']}>{translation.location.selectLocation}</h2>
      <label className={styles['location-label']}>{translation.location.enterLocation}</label>
      <input
        type="text"
        className={styles['location-input']}
        placeholder={translation.location.locationPlaceholder}
      />
      <button className={styles['location-find-button']}>
        <img
          src="/images/Prof/location_icon.png"
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
      <button className={styles['location-continue-button']}>{translation.location.continue}</button>
    </div>
  );
}

export default LocationComponentPopup;
