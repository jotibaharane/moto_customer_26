import {
  Camera,
  Images,
  LineLayer,
  MapView,
  MarkerView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';

import { RootState } from '@store/rootReducer';

import { animateMarker, getSmoothHeading } from '@utils/animation.utils';

import { isValidLocation } from '@utils/location.utils';

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PermissionsAndroid, Platform, Text, View } from 'react-native';

import { useSelector } from 'react-redux';

import { getDirections } from '@api/mapbox/mapbox.api';

import { styles } from '../reporting.style';

/* ========================================================================== */
/* CONFIG                                                                     */
/* ========================================================================== */

/**
 * Driver must be this far away from the current route
 * before we consider re-routing.
 */
const OFF_ROUTE_DISTANCE_METERS = 100;

/**
 * Don't call Directions more frequently than this.
 */
const REROUTE_COOLDOWN_MS = 10_000;

/**
 * Minimum GPS movement before route progress is recalculated.
 */
const MIN_LOCATION_CHANGE_METERS = 5;

/**
 * Minimum camera movement.
 */
const CAMERA_UPDATE_DISTANCE_METERS = 10;

/**
 * Map camera.
 */
const CAMERA_ZOOM = 17;
const CAMERA_PITCH = 60;

/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */

type Coordinate = [number, number];

interface RouteGeometry {
  type: 'LineString';
  coordinates: Coordinate[];
}

interface RouteFeature {
  type: 'Feature';
  properties: {
    distance?: number;
    duration?: number;
  };
  geometry: RouteGeometry;
}

/* ========================================================================== */
/* GEO HELPERS                                                                */
/* ========================================================================== */

/**
 * Calculate distance between two coordinates in meters.
 */
const getDistanceMeters = (first: Coordinate, second: Coordinate): number => {
  const R = 6371000;

  const lat1 = (first[1] * Math.PI) / 180;

  const lat2 = (second[1] * Math.PI) / 180;

  const deltaLat = ((second[1] - first[1]) * Math.PI) / 180;

  const deltaLng = ((second[0] - first[0]) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Find nearest point on the route.
 *
 * This runs completely locally.
 *
 * NO MAPBOX API REQUEST.
 */
const findNearestRoutePoint = (
  current: Coordinate,
  route: RouteGeometry,
  startIndex: number,
) => {
  const coordinates = route.coordinates;

  if (!coordinates.length) {
    return null;
  }

  let nearestIndex = startIndex;
  let nearestDistance = Infinity;

  /**
   * We don't need to scan the whole route every time.
   *
   * Search around the driver's current progress.
   */
  const searchStart = Math.max(0, startIndex - 20);

  const searchEnd = Math.min(coordinates.length, startIndex + 300);

  for (let index = searchStart; index < searchEnd; index++) {
    const point = coordinates[index];

    const distance = getDistanceMeters(current, point);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  }

  return {
    index: nearestIndex,
    distance: nearestDistance,
  };
};

/**
 * Return remaining route after driver progress.
 *
 * Completely local.
 */
const getRemainingRoute = (
  route: RouteGeometry,
  index: number,
): RouteGeometry => {
  const coordinates = route.coordinates.slice(index);

  return {
    type: 'LineString',
    coordinates,
  };
};

/* ========================================================================== */
/* COMPONENT                                                                  */
/* ========================================================================== */

const MapComponent = () => {
  const { driver } = useSelector((state: RootState) => state.map);

  const cameraRef = useRef<any>(null);

  /* ------------------------------------------------------------------------ */
  /* DRIVER LOCATION                                                          */
  /* ------------------------------------------------------------------------ */

  const [animatedCoords, setAnimatedCoords] = useState<Coordinate | null>(null);

  const [heading, setHeading] = useState(0);

  /* ------------------------------------------------------------------------ */
  /* ROUTE                                                                    */
  /* ------------------------------------------------------------------------ */

  const [routeGeoJSON, setRouteGeoJSON] = useState<RouteFeature | null>(null);

  /**
   * Complete route.
   *
   * This survives driver state updates.
   */
  const fullRouteRef = useRef<RouteFeature | null>(null);

  /**
   * Current route index.
   */
  const routeIndexRef = useRef(0);

  /**
   * Last GPS coordinate processed.
   */
  const lastLocationRef = useRef<Coordinate | null>(null);

  /**
   * Last Directions request time.
   */
  const lastRouteRequestRef = useRef(0);

  /**
   * Prevent multiple simultaneous route requests.
   */
  const routeLoadingRef = useRef(false);

  /**
   * Current navigation leg.
   *
   * Example:
   *
   * PICKUP
   *
   * or
   *
   * DELIVERY
   */
  const navigationLegRef = useRef<string>('');

  /**
   * Route key.
   *
   * Changes only when destination/leg changes.
   */
  const routeKeyRef = useRef<string>('');

  /* ======================================================================== */
  /* DESTINATION                                                              */
  /* ======================================================================== */

  const isPickupLeg = useMemo(() => {
    return (
      driver?.tripStatus === 'DRIVER_ACCEPTED' ||
      driver?.tripStatus === 'DRIVER_NEAR_PICKUP'
    );
  }, [driver?.tripStatus]);

  const destinationCoordinate = useMemo(() => {
    if (isPickupLeg) {
      return driver?.pickupCoordinate;
    }

    return driver?.destinationCoordinate;
  }, [isPickupLeg, driver?.pickupCoordinate, driver?.destinationCoordinate]);

  const hasDestination = isValidLocation(destinationCoordinate);

  /* ======================================================================== */
  /* NAVIGATION LEG                                                           */
  /* ======================================================================== */

  const navigationLeg = isPickupLeg ? 'PICKUP' : 'DELIVERY';

  /* ======================================================================== */
  /* ROUTE KEY                                                                */
  /* ======================================================================== */

  const routeKey = useMemo(() => {
    if (!driver || !hasDestination || !destinationCoordinate) {
      return '';
    }

    return [
      navigationLeg,

      destinationCoordinate.latitude,
      destinationCoordinate.longitude,
    ].join(':');
  }, [driver, hasDestination, navigationLeg, destinationCoordinate]);

  /* ======================================================================== */
  /* GET INITIAL ROUTE                                                        */
  /* ======================================================================== */

  useEffect(() => {
    if (!driver || !hasDestination || !destinationCoordinate) {
      return;
    }

    /**
     * IMPORTANT:
     *
     * Don't request again if we're already
     * navigating the same leg.
     */
    if (routeKeyRef.current === routeKey && fullRouteRef.current) {
      return;
    }

    /**
     * Prevent duplicate requests.
     */
    if (routeLoadingRef.current) {
      return;
    }

    const driverLng = Number(driver.longitude);

    const driverLat = Number(driver.latitude);

    const destinationLng = Number(destinationCoordinate.longitude);

    const destinationLat = Number(destinationCoordinate.latitude);

    if (
      !Number.isFinite(driverLng) ||
      !Number.isFinite(driverLat) ||
      !Number.isFinite(destinationLng) ||
      !Number.isFinite(destinationLat)
    ) {
      return;
    }

    const from: Coordinate = [driverLng, driverLat];

    const to: Coordinate = [destinationLng, destinationLat];

    routeLoadingRef.current = true;

    /**
     * Save immediately so another render
     * doesn't create another request.
     */
    routeKeyRef.current = routeKey;

    const loadRoute = async () => {
      try {
        console.log(`[ROUTE] 🗺️ Creating ${navigationLeg} route`);

        const result = await getDirections(from, to);

        if (!result) {
          console.warn('[ROUTE] No route found');

          fullRouteRef.current = null;

          setRouteGeoJSON(null);

          return;
        }

        fullRouteRef.current = result as RouteFeature;

        routeIndexRef.current = 0;

        lastRouteRequestRef.current = Date.now();

        /**
         * Initially show complete route.
         */
        setRouteGeoJSON(result as RouteFeature);

        console.log(`[ROUTE] ✅ ${navigationLeg} route loaded`);
      } catch (error) {
        console.error('[ROUTE] ❌ Route error:', error);

        /**
         * Allow retry after failure.
         */
        routeKeyRef.current = '';

        fullRouteRef.current = null;

        setRouteGeoJSON(null);
      } finally {
        routeLoadingRef.current = false;
      }
    };

    loadRoute();
  }, [
    driver?.tripStatus,
    driver?.longitude,
    driver?.latitude,
    hasDestination,
    destinationCoordinate?.latitude,
    destinationCoordinate?.longitude,
    navigationLeg,
    routeKey,
  ]);

  /* ======================================================================== */
  /* REROUTE                                                                  */
  /* ======================================================================== */

  const reroute = useCallback(
    async (current: Coordinate) => {
      if (!driver || !destinationCoordinate) {
        return;
      }

      /**
       * Already requesting?
       */
      if (routeLoadingRef.current) {
        return;
      }

      /**
       * Cooldown.
       */
      const now = Date.now();

      if (now - lastRouteRequestRef.current < REROUTE_COOLDOWN_MS) {
        return;
      }

      const destination: Coordinate = [
        Number(destinationCoordinate.longitude),
        Number(destinationCoordinate.latitude),
      ];

      if (
        !Number.isFinite(destination[0]) ||
        !Number.isFinite(destination[1])
      ) {
        return;
      }

      routeLoadingRef.current = true;

      lastRouteRequestRef.current = now;

      try {
        console.log('[ROUTE] 🔄 Re-routing...');

        const result = await getDirections(current, destination);

        if (!result) {
          console.warn('[ROUTE] Re-route failed');

          return;
        }

        fullRouteRef.current = result as RouteFeature;

        routeIndexRef.current = 0;

        setRouteGeoJSON(result as RouteFeature);

        console.log('[ROUTE] ✅ Re-route completed');
      } catch (error) {
        console.error('[ROUTE] ❌ Re-route error:', error);
      } finally {
        routeLoadingRef.current = false;
      }
    },
    [driver, destinationCoordinate],
  );

  /* ======================================================================== */
  /* LOCAL ROUTE PROGRESS                                                     */
  /* ======================================================================== */

  const updateRouteProgress = useCallback(
    (current: Coordinate) => {
      const route = fullRouteRef.current;

      if (!route) {
        return;
      }

      const previous = lastLocationRef.current;

      /**
       * Ignore tiny GPS changes.
       */
      if (previous) {
        const movement = getDistanceMeters(previous, current);

        if (movement < MIN_LOCATION_CHANGE_METERS) {
          return;
        }
      }

      lastLocationRef.current = current;

      /**
       * Find nearest route point.
       *
       * LOCAL ONLY.
       */
      const nearest = findNearestRoutePoint(
        current,
        route.geometry,
        routeIndexRef.current,
      );

      if (!nearest) {
        return;
      }

      console.log(
        `[ROUTE] Distance from route: ${Math.round(nearest.distance)}m`,
      );

      /**
       * Driver is OFF ROUTE.
       */
      if (nearest.distance > OFF_ROUTE_DISTANCE_METERS) {
        console.warn(
          `[ROUTE] ⚠️ Driver ${Math.round(nearest.distance)}m off route`,
        );

        /**
         * Don't immediately destroy the
         * existing route.
         *
         * Reroute function has cooldown.
         */
        reroute(current);

        return;
      }

      /**
       * Driver is ON ROUTE.
       */
      routeIndexRef.current = Math.max(routeIndexRef.current, nearest.index);

      /**
       * Draw only remaining route.
       */
      const remaining = getRemainingRoute(
        route.geometry,
        routeIndexRef.current,
      );

      /**
       * Keep route metadata.
       */
      setRouteGeoJSON({
        ...route,
        geometry: remaining,
      });
    },
    [reroute],
  );

  /* ======================================================================== */
  /* DRIVER MOVEMENT                                                          */
  /* ======================================================================== */

  useEffect(() => {
    if (!driver) {
      return;
    }

    const longitude = Number(driver.longitude);

    const latitude = Number(driver.latitude);

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
      console.warn('[DRIVER] Invalid coordinates', driver);

      return;
    }

    const newCoords: Coordinate = [longitude, latitude];

    /**
     * First driver location.
     */
    if (!prevCoordsRef.current) {
      prevCoordsRef.current = newCoords;

      setAnimatedCoords(newCoords);
    }

    /**
     * Smooth marker animation.
     */
    animateMarker(prevCoordsRef.current, newCoords, setAnimatedCoords);

    prevCoordsRef.current = newCoords;

    /**
     * Smooth heading.
     */
    const driverHeading = Number(driver.heading ?? 0);

    const smoothHeading = getSmoothHeading(
      prevHeadingRef.current,
      driverHeading,
    );

    prevHeadingRef.current = smoothHeading;

    setHeading(smoothHeading);

    /**
     * IMPORTANT:
     *
     * This does NOT call Directions.
     *
     * It only processes the existing
     * route locally.
     */
    updateRouteProgress(newCoords);

    /**
     * Follow vehicle.
     *
     * You can remove this if you don't
     * want the camera to follow the driver.
     */
    const previousCamera = previousCameraLocationRef.current;

    if (
      !previousCamera ||
      getDistanceMeters(previousCamera, newCoords) >=
        CAMERA_UPDATE_DISTANCE_METERS
    ) {
      previousCameraLocationRef.current = newCoords;

      cameraRef.current?.setCamera({
        centerCoordinate: newCoords,

        zoomLevel: CAMERA_ZOOM,

        pitch: CAMERA_PITCH,

        heading: smoothHeading,

        animationMode: 'easeTo',

        animationDuration: 500,
      });
    }
  }, [driver, updateRouteProgress]);

  /* ======================================================================== */
  /* REFS FOR DRIVER MOVEMENT                                                 */
  /* ======================================================================== */

  const prevCoordsRef = useRef<Coordinate | null>(null);

  const prevHeadingRef = useRef(0);

  const previousCameraLocationRef = useRef<Coordinate | null>(null);

  /* ======================================================================== */
  /* RESET ROUTE WHEN DRIVER/TRIP IS CLEARED                                  */
  /* ======================================================================== */

  useEffect(() => {
    if (driver) {
      return;
    }

    fullRouteRef.current = null;

    routeIndexRef.current = 0;

    routeKeyRef.current = '';

    lastLocationRef.current = null;

    lastRouteRequestRef.current = 0;

    setRouteGeoJSON(null);

    setAnimatedCoords(null);
  }, [driver]);

  /* ======================================================================== */
  /* PERMISSIONS                                                              */
  /* ======================================================================== */

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const checkPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        console.log('[LOCATION] Permission:', granted);
      } catch (error) {
        console.error('[LOCATION] Permission error:', error);
      }
    };

    checkPermission();
  }, []);

  /* ======================================================================== */
  /* MARKER COORDINATES                                                       */
  /* ======================================================================== */

  const pickupCoords = useMemo(() => {
    if (!isValidLocation(driver?.pickupCoordinate)) {
      return null;
    }

    return [
      Number(driver?.pickupCoordinate.longitude),
      Number(driver?.pickupCoordinate.latitude),
    ] as Coordinate;
  }, [driver?.pickupCoordinate]);

  const destinationCoords = useMemo(() => {
    if (!isValidLocation(driver?.destinationCoordinate)) {
      return null;
    }

    return [
      Number(driver?.destinationCoordinate.longitude),
      Number(driver?.destinationCoordinate.latitude),
    ] as Coordinate;
  }, [driver?.destinationCoordinate]);

  /* ======================================================================== */
  /* DISTANCE / TIME DISPLAY                                                  */
  /* ======================================================================== */

  const isGoingToPickup = navigationLeg === 'PICKUP';

  const displayDistance = isGoingToPickup
    ? driver?.pickupDistance?.distanceKm
    : driver?.deliveryDistance?.distanceKm;

  const displayDuration = isGoingToPickup
    ? driver?.pickupDistance?.durationMin
    : driver?.deliveryDistance?.durationMin;

  /* ======================================================================== */
  /* RENDER                                                                   */
  /* ======================================================================== */

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
        logoEnabled={false}
        scaleBarEnabled={false}
      >
        {/* ================================================================= */}
        {/* CAMERA                                                            */}
        {/* ================================================================= */}

        <Camera ref={cameraRef} />

        {/* ================================================================= */}
        {/* MAP IMAGES                                                        */}
        {/* ================================================================= */}

        <Images
          images={{
            carIcon: require('@assets/images/carIcon.png'),

            pickupIcon: require('@assets/images/marker.png'),

            dropIcon: require('@assets/images/drop_marker.png'),
          }}
        />

        {/* ================================================================= */}
        {/* ROUTE                                                             */}
        {/* ================================================================= */}

        {routeGeoJSON && (
          <ShapeSource id="routeSource" shape={routeGeoJSON}>
            <LineLayer
              id="routeLine"
              style={{
                lineColor: '#2563eb',

                lineWidth: [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  10,
                  4,
                  14,
                  7,
                  18,
                  12,
                ],

                lineCap: 'round',

                lineJoin: 'round',
              }}
            />
          </ShapeSource>
        )}

        {/* ================================================================= */}
        {/* DRIVER                                                            */}
        {/* ================================================================= */}

        {animatedCoords && (
          <ShapeSource
            id="driverSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: animatedCoords,
              },
              properties: {
                heading,
              },
            }}
          >
            <SymbolLayer
              id="driverSymbol"
              style={{
                iconImage: 'carIcon',

                iconSize: [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  10,
                  0.05,
                  14,
                  0.07,
                  18,
                  0.1,
                ],

                iconAnchor: 'center',

                iconRotationAlignment: 'map',

                iconAllowOverlap: true,

                iconIgnorePlacement: true,

                iconRotate: ['get', 'heading'],
              }}
            />
          </ShapeSource>
        )}

        {/* ================================================================= */}
        {/* DRIVER TOOLTIP                                                    */}
        {/* ================================================================= */}

        {animatedCoords && (
          <MarkerView
            coordinate={animatedCoords}
            anchor={{
              x: 0.5,
              y: 1.8,
            }}
          >
            <View style={styles.tooltipContainer}>
              <Text style={styles.tooltipTitle}>
                Distance {displayDistance ?? 0} Km
              </Text>

              <Text style={styles.tooltipText}>
                Time {displayDuration ?? 0} min
              </Text>
            </View>
          </MarkerView>
        )}

        {/* ================================================================= */}
        {/* PICKUP                                                            */}
        {/* ================================================================= */}

        {pickupCoords && (
          <ShapeSource
            id="pickupSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: pickupCoords,
              },
              properties: {},
            }}
          >
            <SymbolLayer
              id="pickupSymbol"
              style={{
                iconImage: 'pickupIcon',

                iconSize: 0.3,

                iconAnchor: 'bottom',

                iconAllowOverlap: true,
              }}
            />
          </ShapeSource>
        )}

        {/* ================================================================= */}
        {/* DESTINATION                                                       */}
        {/* ================================================================= */}

        {destinationCoords && (
          <ShapeSource
            id="destinationSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: destinationCoords,
              },
              properties: {},
            }}
          >
            <SymbolLayer
              id="destinationSymbol"
              style={{
                iconImage: 'dropIcon',

                iconSize: 0.3,

                iconAnchor: 'bottom',

                iconAllowOverlap: true,
              }}
            />
          </ShapeSource>
        )}
      </MapView>
    </View>
  );
};

export default memo(MapComponent);
