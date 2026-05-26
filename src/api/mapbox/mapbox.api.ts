// @api/mapbox/mapbox.api.ts

import { fetchClient } from '@api/client';
import Config from 'react-native-config';

// =========================
// REVERSE GEOCODE
// =========================

export const reverseGeocode = async (lat: number, lng: number) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${'pk.eyJ1IjoicmFtZXNobW90byIsImEiOiJjbWt4c2swb2QwYzA1M2Nxemg2MzZjZG5jIn0.r9DupyA23H--LeacRtBXKA'}&limit=1&language=en`;

  return fetchClient(url);
};

// =========================
// GET DIRECTIONS
// =========================

export const getDirections = async (pickup: number[], dest: number[]) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${
    pickup[0]
  },${pickup[1]};${dest[0]},${
    dest[1]
  }?geometries=geojson&overview=full&access_token=${'pk.eyJ1IjoicmFtZXNobW90byIsImEiOiJjbWt4c2swb2QwYzA1M2Nxemg2MzZjZG5jIn0.r9DupyA23H--LeacRtBXKA'}`;

  const json = await fetchClient(url);

  if (!json?.routes?.length) {
    return null;
  }

  const route = json.routes[0];

  // ✅ CORRECT GEOJSON FORMAT
  return {
    type: 'Feature',

    properties: {
      distance: route.distance,
      duration: route.duration,
    },

    geometry: {
      type: 'LineString',

      coordinates: route.geometry.coordinates,
    },
  };
};
