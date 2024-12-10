import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchHospitals = async () => {
    if (currentPosition) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=10&lat=${currentPosition.lat}&lon=${currentPosition.lng}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching hospital data:', error);
      }
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [currentPosition]);

  return (
    <MapContainer
      center={currentPosition || [0, 0]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {currentPosition && (
        <Marker position={currentPosition}>
          <Popup>You are here!</Popup>
        </Marker>
      )}
      {hospitals.map((hospital, index) => (
        <Marker
          key={index}
          position={[hospital.lat, hospital.lon]}
        >
          <Popup>{hospital.display_name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
