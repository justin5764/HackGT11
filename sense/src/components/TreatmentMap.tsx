// src/components/TreatmentMap.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { Facility } from '../types';
import { buildOverpassQuery } from '../utils/overpassQuery';
import { diagnosisToFacilityTypes } from '../utils/diagnosisMapping';

interface TreatmentMapProps {
  diagnosis: string;
}

const TreatmentMap: React.FC<TreatmentMapProps> = ({ diagnosis }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Fix for default marker icon not displaying correctly
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
  });

  // Custom Icons
  const hospitalIcon = new L.Icon({
    iconUrl: '/images/hospital-icon.png',
    iconRetinaUrl: '/images/hospital-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const psychiatristIcon = new L.Icon({
    iconUrl: '/images/psychiatrist-icon.png',
    iconRetinaUrl: '/images/psychiatrist-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const psychologistIcon = new L.Icon({
    iconUrl: '/images/psychologist-icon.png',
    iconRetinaUrl: '/images/psychologist-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const therapistIcon = new L.Icon({
    iconUrl: '/images/therapist-icon.png',
    iconRetinaUrl: '/images/therapist-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const rehabCenterIcon = new L.Icon({
    iconUrl: '/images/rehab-center-icon.png',
    iconRetinaUrl: '/images/rehab-center-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const healthcareIcon = new L.Icon({
    iconUrl: '/images/healthcare-icon.png',
    iconRetinaUrl: '/images/healthcare-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  // Add more custom icons as needed

  const getIconByType = (type: string): L.Icon => {
    switch (type) {
      case 'hospital':
        return hospitalIcon;
      case 'psychiatrist':
        return psychiatristIcon;
      case 'psychologist':
        return psychologistIcon;
      case 'therapist':
        return therapistIcon;
      case 'rehab_center':
        return rehabCenterIcon;
      case 'mental_health_clinic':
        return healthcareIcon;
      case 'addiction_specialist':
        return healthcareIcon;
      case 'sleep_clinic':
        return healthcareIcon;
      case 'maternal_health_clinic':
        return healthcareIcon;
      case 'developmental_clinic':
        return healthcareIcon;
      // Add more cases for other facility types
      default:
        return defaultIcon // Return an instance
    }
  };

  const defaultIcon = new L.Icon({
    iconUrl: '/images/healthcare-icon.png',
    iconRetinaUrl: '/images/healthcare-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  // Fetch user's location using Geolocation API
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        setError('Unable to retrieve your location.');
      }
    );
  }, []);

  // Fetch nearby facilities once userLocation and diagnosis are available
  useEffect(() => {
    if (!userLocation || !diagnosis) return;

    const fetchFacilities = async () => {
      setLoading(true);
      setError('');
      try {
        const [lat, lon] = userLocation;
        const query = buildOverpassQuery(diagnosis, lat, lon);

        const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
          headers: {
            'Content-Type': 'text/plain',
          },
        });

        const elements = response.data.elements;

        const fetchedFacilities: Facility[] = elements
          .filter((element: any) => element.type === 'node')
          .map((element: any) => ({
            id: element.id,
            name: element.tags.name || 'Unnamed Facility',
            address:
              element.tags['addr:full'] ||
              `${element.tags['addr:housenumber'] || ''} ${
                element.tags['addr:street'] || ''
              }, ${element.tags['addr:city'] || ''}`,
            coordinates: [element.lat, element.lon],
            type: element.tags.healthcare || 'healthcare',
          }));

        if (fetchedFacilities.length === 0) {
          setError('No nearby treatment facilities found for your diagnosis.');
        }

        setFacilities(fetchedFacilities);
      } catch (err) {
        console.error('Error fetching facilities:', err);
        setError('Failed to fetch nearby treatment facilities.');
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [userLocation, diagnosis]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!userLocation) {
    return <p>Retrieving your location...</p>;
  }

  return (
    <div className="relative w-full h-96 mt-8">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-75">
          <p>Loading nearby treatment facilities...</p>
        </div>
      )}
      <MapContainer center={userLocation} zoom={13} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* User Location Marker */}
        <Marker position={userLocation}>
          <Popup>Your Location</Popup>
        </Marker>
        {/* Facilities Markers */}
        {facilities.map((facility) => (
          <Marker key={facility.id} position={facility.coordinates} icon={getIconByType(facility.type)}>
            <Popup>
              <strong>{facility.name}</strong>
              <br />
              {facility.address}
              <br />
              Type: {facility.type.replace('_', ' ')}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TreatmentMap;