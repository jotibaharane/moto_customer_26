import {
  Camera,
  Images,
  LineLayer,
  Location,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
  UserLocation,
} from '@rnmapbox/maps';
import { RootState } from '@store/rootReducer';
import { setCurrentLocation } from '@store/slices/Auth/authSlice';
import { COLORS } from '@theme/index';
import { isValidLocation } from '@utils/location.utils';
import { LocateFixed } from 'lucide-react-native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getMapboxRoute } from '../../../../services/location/location.service';
import { styles } from '../Dashboard.style';

const MapComponent = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState<Location>();
  const booking = useSelector((state: RootState) => state.booking);
  const cameraRef = useRef<any>(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  // const { location } = useCurrentLocation();

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
        centerCoordinate: [
          location.coords?.longitude,
          location.coords?.latitude,
        ],
        zoomLevel: 17,
        pitch: 40,
        animationMode: 'easeTo',
        animationDuration: 1000,
      });
    }
  }, [booking?.pickup, booking?.delivery, location]);

  const handleRecenter = useCallback(() => {
    if (!location?.coords || !cameraRef.current) {
      return;
    }

    cameraRef.current.setCamera({
      centerCoordinate: [location.coords.longitude, location.coords.latitude],
      zoomLevel: 17,
      pitch: 40,
      heading: location.coords.heading ?? 0,
      animationMode: 'flyTo',
      animationDuration: 500,
    });
  }, [location]);

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/navigation-day-v1"
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
            carIcon: require('@assets/images/carIcon.png'),
            pickupIcon: require('@assets/images/marker.png'),
            dropIcon: require('@assets/images/drop_marker.png'),
          }}
        />

        {location?.coords?.latitude && (
          <ShapeSource
            id="vehicleSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [
                  location?.coords?.longitude,
                  location?.coords?.latitude,
                ],
              },
              properties: {
                heading: location?.coords?.heading,
              },
            }}
          >
            <SymbolLayer
              id="vehicleLayer"
              style={{
                iconImage: 'carIcon',
                iconSize: 0.1,
                iconAllowOverlap: true,
                iconIgnorePlacement: true,
                iconRotate: ['get', 'heading'],
                iconRotationAlignment: 'map',
              }}
            />
          </ShapeSource>
        )}

        <UserLocation
          visible={false}
          minDisplacement={1}
          onUpdate={location => {
            setLocation(location);
            console.log({ location });
            dispatch(
              setCurrentLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              }),
            );

            cameraRef.current?.setCamera({
              centerCoordinate: [
                location?.coords?.longitude,
                location?.coords?.latitude,
              ],
              zoomLevel: 18,
              pitch: 60,
              heading: location.coords.heading || 0,
              animationMode: 'linearTo',
              animationDuration: 250,
            });
          }}
        />

        {/* 🔵 ROUTE FIRST */}
        {routeGeoJSON && (
          <ShapeSource id="routeSource" shape={routeGeoJSON}>
            <LineLayer
              id="routeLineCasing"
              style={{
                lineColor: '#FFFFFF',
                lineWidth: 10,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            <LineLayer
              id="routeLine"
              style={{
                lineColor: '#2E5A99',
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
                iconSize: 0.28,
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
                iconSize: 0.28,
                iconAnchor: 'bottom', // 🔥 KEY FIX
              }}
            />
          </ShapeSource>
        )}
      </MapView>

      <TouchableOpacity
        style={mapComponentStyles.recenterButton}
        activeOpacity={0.85}
        onPress={handleRecenter}
      >
        <LocateFixed size={22} color={COLORS.primary[500]} />
      </TouchableOpacity>
    </View>
  );
};

const mapComponentStyles = StyleSheet.create({
  recenterButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white[100],
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default memo(MapComponent);
