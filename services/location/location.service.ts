import { reverseGeocode } from '@api/mapbox/mapbox.api';

export const getLocationPayload = async ({ latitude, longitude }: any) => {
  const apiResponse = await reverseGeocode(latitude, longitude);

  return apiResponse;
};
