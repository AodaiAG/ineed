import React, { useState, useEffect } from 'react';
import PC from '../../components/client/PC';
import translations from '../../utils/translations.json';
import { useLanguage } from '../../components/LanguageContext'; // Import the useLanguage hook

function LocationPage() {
    const [address, setAddress] = useState(localStorage.getItem('location') || '');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const { translation, language } = useLanguage(); // Access translation and language from the context
    const getDirection = () => {
        if (language === 'ar' || language === 'he') return 'rtl';
        return 'ltr';
    };

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
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: initialLocation,
            zoom: 7,
        });

        const marker = new window.google.maps.Marker({
            position: initialLocation,
            map,
        });

        const input = document.getElementById('locationInput');
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
                    const map = new window.google.maps.Map(document.getElementById('map'), {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (address.trim() === '') {
            alert(translation.invalidLocation);
        } else {
            localStorage.setItem('location', address);
            window.location.href = '/main';
        }
    };

    return (
        <div className="container"> {/* Wrapped everything inside this parent div */}
            <div className="row">
                <PC />
                <div className="right-col">
                    <div className="phone-case">
                        <img src="/images/phone.png" alt="Phone Case" />
                        <div className="phone-screen">
                            <div className="content">
                                <h2>{translation.selectLocation2}</h2>
                                <label htmlFor="locationInput">{translation.typeLocation}</label>
                                <input
                                    type="text"
                                    id="locationInput"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder={translation.placeholder}
                                />
                                <button className="myLocationBtn" onClick={handleFindMe} dir={getDirection()}>
                                    {translation.findMe} <i className="ri-map-pin-fill"></i>
                                </button>
                                <input type="hidden" id="lat" value={lat} />
                                <input type="hidden" id="lon" value={lon} />
                                <div id="map" style={{ height: '400px', width: '100%' }}></div>
                                <button onClick={handleSubmit} className="locationSubmitBtn" type="submit">
                                    {translation.confirm}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LocationPage;
