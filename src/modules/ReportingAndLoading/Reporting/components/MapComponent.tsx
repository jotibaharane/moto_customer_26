import { getDirections } from '@api/mapbox/mapbox.api';
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
import React, { memo, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from '../reporting.style';

const MapComponent = () => {
  const cameraRef = useRef<any>(null);
  const { driver, status, tracking } = useSelector(
    (state: RootState) => state.map,
  );
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const [animatedCoords, setAnimatedCoords] = useState<[number, number] | null>(
    null,
  );

  console.log({ driver, status, tracking });
  const prevCoords = useRef<[number, number] | null>(null);
  const prevHeading = useRef(0);

  // =========================
  // DRIVER LIVE MOVEMENT
  // =========================

  useEffect(() => {
    if (!driver) return;

    const lng = Number(driver?.longitude);
    const lat = Number(driver?.latitude);

    // INVALID COORDS
    if (isNaN(lng) || isNaN(lat)) {
      console.log('Invalid driver coordinates', driver);
      return;
    }

    const newCoords: [number, number] = [lng, lat];

    // FIRST TIME
    if (!prevCoords.current) {
      prevCoords.current = newCoords;
      setAnimatedCoords(newCoords);
    }

    // SMOOTH ANIMATION
    animateMarker(prevCoords.current, newCoords, setAnimatedCoords);
    prevCoords.current = newCoords;
    const smoothHeading = getSmoothHeading(
      prevHeading.current,
      driver.heading || 0,
    );

    prevHeading.current = smoothHeading;
    cameraRef.current?.setCamera({
      centerCoordinate: newCoords,
      zoomLevel: 17,
      pitch: 60,
      heading: smoothHeading,
      animationMode: 'easeTo',
      animationDuration: 1000,
    });
  }, [driver]);

  // =========================
  // NAVIGATION
  // =========================
  useEffect(() => {
    if (!driver?.pickupCoordinate || !driver) return;

    const loadRoute = async () => {
      try {
        const from = [driver?.longitude, driver?.latitude];
        const to =
          driver?.tripStatus === 'DRIVER_ACCEPTED' ||
          driver?.tripStatus === 'DRIVER_NEAR_PICKUP'
            ? [
                driver?.pickupCoordinate?.longitude,
                driver?.pickupCoordinate?.latitude,
              ]
            : [
                driver?.destinationCoordinate?.longitude,
                driver?.destinationCoordinate?.latitude,
              ];
        const res = await getDirections(from, to);
        if (!res) return;
        setRouteGeoJSON(res);
      } catch (e) {
        console.log('Route error', e);
      }
    };

    loadRoute();
  }, [driver]);

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
        logoEnabled={false}
        scaleBarEnabled={false}
      >
        {/* CAMERA */}
        <Camera ref={cameraRef} />

        {/* IMAGES */}
        <Images
          images={{
            carIcon: require('@assets/images/carIcon.png'),
            pickupIcon: require('@assets/images/marker.png'),
            dropIcon: require('@assets/images/drop_marker.png'),
          }}
        />

        {/* ========================= */}
        {/* ROUTE */}
        {/* ========================= */}

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

        {/* ========================= */}
        {/* DRIVER VEHICLE */}
        {/* ========================= */}

        {animatedCoords && (
          <ShapeSource
            id="driverSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: animatedCoords,
              },
              properties: {},
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
                iconRotate: prevHeading.current,
              }}
            />
          </ShapeSource>
        )}

        {/* ========================= */}
        {/* TOOLTIP */}
        {/* ========================= */}

        {animatedCoords && (
          <MarkerView coordinate={animatedCoords} anchor={{ x: 0.5, y: 1.8 }}>
            <View style={styles.tooltipContainer}>
              <Text style={styles.tooltipTitle}>
                Distance{' '}
                {driver?.tripStatus === 'DRIVER_ACCEPTED' ||
                driver?.tripStatus === 'DRIVER_NEAR_PICKUP'
                  ? driver?.pickupDistance?.distanceKm || 0
                  : driver?.deliveryDistance?.distanceKm || 0}{' '}
                Km
              </Text>
              <Text style={styles.tooltipText}>
                Time{' '}
                {driver?.tripStatus === 'DRIVER_ACCEPTED' ||
                driver?.tripStatus === 'DRIVER_NEAR_PICKUP'
                  ? driver?.pickupDistance?.durationMin || 0
                  : driver?.deliveryDistance?.durationMin || 0}{' '}
                min
              </Text>
            </View>
          </MarkerView>
        )}

        {/* ========================= */}
        {/* PICKUP */}
        {/* ========================= */}

        {isValidLocation(driver?.pickupCoordinate) && (
          <ShapeSource
            id="pickupSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [
                  driver?.pickupCoordinate?.longitude,
                  driver?.pickupCoordinate?.latitude,
                ],
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
              }}
            />
          </ShapeSource>
        )}

        {/* ========================= */}
        {/* DELEVERY */}
        {/* ========================= */}

        {isValidLocation(driver?.destinationCoordinate) && (
          <ShapeSource
            id="pickupSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [
                  driver?.destinationCoordinate?.longitude,
                  driver?.destinationCoordinate?.latitude,
                ],
              },
              properties: {},
            }}
          >
            <SymbolLayer
              id="pickupSymbol"
              style={{
                iconImage: 'dropIcon',
                iconSize: 0.3,
                iconAnchor: 'bottom',
              }}
            />
          </ShapeSource>
        )}
      </MapView>
    </View>
  );
};

export default memo(MapComponent);
