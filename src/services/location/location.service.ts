import { reverseGeocode } from '@api/mapbox/mapbox.api';
import { MAPBOX_ACCESS_TOKEN } from '@utils/constants';

export const getLocationPayload = async ({ latitude, longitude }: any) => {
  const apiResponse = await reverseGeocode(latitude, longitude);

  return apiResponse;
};

// export const getMapboxRoute = async (
//   origin: { lng: number; lat: number },
//   destination: { lng: number; lat: number },
// ) => {
//   const coordinatesString = `${origin?.lng},${origin.lat};${destination.lat},${destination.lng}`;
//   const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&overview=full&access_token=${MAPBOX_ACCESS_TOKEN}`;
//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.routes && data.routes.length > 0) {
//       // Returns the geometry object: { type: 'LineString', coordinates: [...] }
//       return data.routes[0].geometry;
//     }
//     return null;
//   } catch (error) {
//     console.error('Error fetching Mapbox directions:', error);
//     return null;
//   }
// };

export const getMapboxRoute = async (
  origin: { lng: number; lat: number },
  destination: { lng: number; lat: number },
) => {
  const coordinatesString = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?geometries=geojson&overview=full&access_token=${MAPBOX_ACCESS_TOKEN}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    if (data.routes?.length) {
      return data.routes[0].geometry;
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
