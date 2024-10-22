import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext'; // Import useLanguage hook
import styles from '../../styles/LocationComponentPopup.module.css'; // Ensure the path is correct

function LocationComponentPopup({ onClose, onSelect }) {
  const { translation } = useLanguage(); // Use the translation object from context
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        const interval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(interval);
            initMap();
          }
        }, 100);
      }
    };

    loadGoogleMaps();
  }, []);

  const initMap = () => {
    const initialLocation = { lat: 31.0461, lng: 34.8516 };
    const map = new window.google.maps.Map(document.getElementById('popupMap'), {
      center: initialLocation,
      zoom: 7,
    });

    const marker = new window.google.maps.Marker({
      position: initialLocation,
      map,
    });

    const input = document.getElementById('popupLocationInput');
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        alert("No details available for input: '" + place.name + "'");
        return;
      }
      map.setCenter(place.geometry.location);
      map.setZoom(13);
      marker.setPosition(place.geometry.location);

      setLat(place.geometry.location.lat());
      setLon(place.geometry.location.lng());
      setAddress(place.formatted_address);
    });
  };

  const handleFindMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);
          const location = new window.google.maps.LatLng(latitude, longitude);
          const map = new window.google.maps.Map(document.getElementById('popupMap'), {
            center: location,
            zoom: 13,
          });
          const marker = new window.google.maps.Marker({
            position: location,
            map,
          });

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setAddress(results[0].formatted_address);
            } else {
              alert('Geocoder failed due to: ' + status);
            }
          });
        },
        (error) => {
          alert(translation.geolocationError);
        }
      );
    } else {
      alert(translation.geolocationError);
    }
  };

  return ReactDOM.createPortal(
    <div className={styles['popupOverlay']}>
      <div className={styles['location-container']}>
        <h2 className={styles['location-title']}>{translation.location.selectLocation}</h2>
        <label className={styles['location-label']}>{translation.location.enterLocation}</label>
        <input
          type="text"
          id="popupLocationInput"
          className={styles['location-input']}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={translation.location.locationPlaceholder}
        />
        <button className={styles['location-find-button']} onClick={handleFindMe}>
          <img
            src="/images/location_icon.png"
            alt={translation.location.locationIconAlt}
            className={styles['location-button-icon']}
          />
          {translation.location.findMe}
        </button>
        <div className={styles['location-map-container']}>
          <div id="popupMap" className={styles['location-map-image']} style={{ height: '200px', width: '100%' }}></div>
        </div>
        <button
          className={styles['location-continue-button']}
          onClick={() => {
            onSelect(address);
            onClose();
          }}
        >
          {translation.location.continue}
        </button>
      </div>
    </div>,
    document.body // Append to body to ensure it is rendered as an overlay
  );
}

export default LocationComponentPopup;
