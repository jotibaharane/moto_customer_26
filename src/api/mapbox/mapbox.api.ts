import { fetchClient } from '@api/client';
import Config from 'react-native-config';

export const reverseGeocode = async (lat: number, lng: number) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${Config.MAPBOX_ACCESS_TOKEN}&limit=1&language=en`;

  return fetchClient(url);
};

export const getDirections = async (pickup: number[], dest: number[]) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${
    pickup[0]
  },${pickup[1]};${dest[0]},${
    dest[1]
  }?geometries=geojson&overview=full&access_token=${Config.MAPBOX_ACCESS_TOKEN!}`;

  const json = await fetchClient(url);

  if (!json.routes?.length) {
    return null;
  }

  const route = json.routes[0];

  return {
    geometry: {
      type: 'Feature',
      properties: {},
      geometry: route.geometry,
    },
    distance: route.distance,
    duration: route.duration,
  };
};
