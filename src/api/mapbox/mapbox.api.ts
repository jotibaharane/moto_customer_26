import { fetchClient } from '@api/client';
import { MAPBOX_ACCESS_TOKEN } from '@utils/constants';

/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */

export type MapCoordinate = [number, number];

interface DirectionsResponse {
  routes?: Array<{
    distance?: number;
    duration?: number;

    geometry?: {
      type: 'LineString';
      coordinates: MapCoordinate[];
    };
  }>;
}

/* ========================================================================== */
/* REVERSE GEOCODE                                                            */
/* ========================================================================== */

export const reverseGeocode = async (lat: number, lng: number) => {
  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
    `${lng},${lat}.json` +
    `?access_token=${MAPBOX_ACCESS_TOKEN}` +
    `&limit=1` +
    `&language=en`;

  return fetchClient(url);
};

/* ========================================================================== */
/* DIRECTIONS                                                                 */
/* ========================================================================== */

/**
 * Get route between two points.
 *
 * IMPORTANT:
 *
 * This function performs a real Mapbox Directions
 * API request.
 *
 * It should NOT be called from every GPS update.
 */
export const getDirections = async (
  pickup: MapCoordinate,
  dest: MapCoordinate,
) => {
  if (
    !Number.isFinite(pickup[0]) ||
    !Number.isFinite(pickup[1]) ||
    !Number.isFinite(dest[0]) ||
    !Number.isFinite(dest[1])
  ) {
    console.warn('[MAPBOX] Invalid directions coordinates', {
      pickup,
      dest,
    });

    return null;
  }

  const coordinates = `${pickup[0]},${pickup[1]};` + `${dest[0]},${dest[1]}`;

  const params = new URLSearchParams({
    geometries: 'geojson',
    overview: 'full',
    steps: 'false',
    access_token: MAPBOX_ACCESS_TOKEN,
  });

  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${coordinates}?${params.toString()}`;

  try {
    const json = (await fetchClient(url)) as DirectionsResponse;

    if (!json?.routes?.length) {
      console.warn('[MAPBOX] No routes returned');

      return null;
    }

    const route = json.routes[0];

    if (!route?.geometry?.coordinates?.length) {
      console.warn('[MAPBOX] Route geometry missing');

      return null;
    }

    /**
     * GeoJSON Feature.
     */
    return {
      type: 'Feature' as const,

      properties: {
        distance: route.distance ?? 0,

        duration: route.duration ?? 0,
      },

      geometry: {
        type: 'LineString' as const,

        coordinates: route.geometry.coordinates,
      },
    };
  } catch (error) {
    console.error('[MAPBOX] Directions error:', error);

    return null;
  }
};
