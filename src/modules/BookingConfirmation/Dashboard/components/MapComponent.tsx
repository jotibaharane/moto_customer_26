import { useCurrentLocation } from '@hooks/useCurrentLocation';
import {
  Camera,
  Images,
  LineLayer,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import { RootState } from '@store/rootReducer';
import { isValidLocation } from '@utils/location.utils';
import React, { memo, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { getMapboxRoute } from '../../../../services/location/location.service';
import { styles } from '../Dashboard.style';

const MapComponent = () => {
  const booking = useSelector((state: RootState) => state.booking);
  const cameraRef = useRef<any>(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const { location } = useCurrentLocation();

  /* ================= ROUTE ================= */
  useEffect(() => {
    if (
      isValidLocation({
        latitude: booking?.pickup?.latitude?.toString(),
        longitude: booking?.pickup?.longitude?.toString(),
      }) &&
      isValidLocation({
        latitude: booking?.delivery?.latitude?.toString(),
        longitude: booking?.delivery?.longitude?.toString(),
      })
    ) {
      const fetchAutomatedRoute = async () => {
        const geometry = await getMapboxRoute(
          {
            lat: booking?.pickup?.latitude!,
            lng: booking?.pickup?.longitude!,
          },
          {
            lat: booking?.delivery?.latitude!,
            lng: booking?.delivery?.longitude!,
          },
        );
        if (geometry) {
          setRouteGeoJSON(geometry);
          // setRouteGeoJSON({
          //   type: 'Feature',
          //   properties: {},
          //   geometry,
          // });
        }
      };

      fetchAutomatedRoute();
    } else {
      setRouteGeoJSON(null);
    }
  }, [booking?.pickup, booking?.delivery]);

  /* ================= CAMERA ================= */
  useEffect(() => {
    if (!cameraRef.current) return;

    const hasPickup = isValidLocation({
      latitude: booking?.pickup?.latitude?.toString(),
      longitude: booking?.pickup?.longitude?.toString(),
    });
    const hasDrop = isValidLocation({
      latitude: booking?.delivery?.latitude?.toString(),
      longitude: booking?.delivery?.longitude?.toString(),
    });

    // ✅ BOTH → FIT ROUTE
    if (hasPickup && hasDrop) {
      cameraRef.current.fitBounds(
        [booking.pickup.longitude, booking.pickup.latitude],
        [booking.delivery.longitude, booking.delivery.latitude],
        80,
        1200,
      );
      return;
    }

    // ✅ ONLY PICKUP
    if (hasPickup) {
      cameraRef.current.setCamera({
        centerCoordinate: [booking.pickup.longitude, booking.pickup.latitude],
        zoomLevel: 16,
        pitch: 45,
        animationMode: 'easeTo',
        animationDuration: 1000,
      });
      return;
    }

    // ✅ ONLY DROP
    if (hasDrop) {
      cameraRef.current.setCamera({
        centerCoordinate: [
          booking.delivery.longitude,
          booking.delivery.latitude,
        ],
        zoomLevel: 16,
        pitch: 45,
        animationMode: 'easeTo',
        animationDuration: 1000,
      });
      return;
    }

    // 🔥 INITIAL CURRENT LOCATION (FIXED)
    if (location) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.lng, location.lat],
        zoomLevel: 17,
        pitch: 40,
        animationMode: 'easeTo',
        animationDuration: 1000,
      });
    }
  }, [booking?.pickup, booking?.delivery, location]);
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v12"
        scaleBarEnabled={false}
        logoEnabled={false}
      >
        <Camera ref={cameraRef} />

        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true }}
        />
        {/* 🔥 IMAGES */}
        <Images
          images={{
            pickupIcon: require('@assets/images/marker.png'),
            dropIcon: require('@assets/images/drop_marker.png'),
          }}
        />

        {/* 🔵 ROUTE FIRST */}
        {routeGeoJSON && (
          <ShapeSource id="routeSource" shape={routeGeoJSON}>
            <LineLayer
              id="routeLine"
              style={{
                lineColor: '#2563eb',
                lineWidth: 6,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </ShapeSource>
        )}

        {/* 🟢 PICKUP */}
        {isValidLocation({
          latitude: booking?.pickup?.latitude?.toString(),
          longitude: booking?.pickup?.longitude?.toString(),
        }) && (
          <ShapeSource
            id="pickupSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [
                  booking.pickup.longitude!,
                  booking.pickup.latitude!,
                ],
              },
              properties: {},
            }}
          >
            <SymbolLayer
              id="pickupSymbol"
              style={{
                iconImage: 'pickupIcon',
                iconSize: 0.25,
                iconAnchor: 'bottom', // 🔥 KEY FIX
              }}
            />
          </ShapeSource>
        )}

        {/* 🔴 DROP */}
        {isValidLocation({
          latitude: booking?.delivery?.latitude?.toString(),
          longitude: booking?.delivery?.longitude?.toString(),
        }) && (
          <ShapeSource
            id="dropSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [
                  booking.delivery.longitude!,
                  booking.delivery.latitude!,
                ],
              },
              properties: {},
            }}
          >
            <SymbolLayer
              id="dropSymbol"
              style={{
                iconImage: 'dropIcon',
                iconSize: 0.48,
                iconAnchor: 'bottom', // 🔥 KEY FIX
              }}
            />
          </ShapeSource>
        )}
      </MapView>
    </View>
  );
};

export default memo(MapComponent);
