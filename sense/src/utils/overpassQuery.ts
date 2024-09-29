// src/utils/overpassQuery.ts

import { diagnosisToFacilityTypes } from './diagnosisMapping';

export const buildOverpassQuery = (
  diagnosis: string,
  lat: number,
  lon: number
): string => {
  const facilityTypes = diagnosisToFacilityTypes[diagnosis.toLowerCase()] || [
    'hospital',
    'clinic',
    'doctors',
  ];

  // Construct individual facility type queries
  const facilityQueries = facilityTypes.map((type) => {
    // Handle special cases if any
    if (type === 'mental_health_clinic') {
      return `node["healthcare"="mental_health_clinic"](around:10000,${lat},${lon});`;
    } else if (type === 'addiction_specialist') {
      return `node["healthcare"="addiction_specialist"](around:10000,${lat},${lon});`;
    } else if (type === 'sleep_clinic') {
      return `node["healthcare"="sleep_clinic"](around:10000,${lat},${lon});`;
    } else if (type === 'maternal_health_clinic') {
      return `node["healthcare"="maternal_health_clinic"](around:10000,${lat},${lon});`;
    } else if (type === 'developmental_clinic') {
      return `node["healthcare"="developmental_clinic"](around:10000,${lat},${lon});`;
    }
    // Default case
    return `node["healthcare"="${type}"](around:10000,${lat},${lon});`;
  });

  // Join all facility queries
  const fullQuery = `
    [out:json][timeout:25];
    (
      ${facilityQueries.join('\n      ')}
    );
    out body;
    >;
    out skel qt;
  `;

  return fullQuery;
};