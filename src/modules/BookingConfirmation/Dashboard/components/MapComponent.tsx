import { View, Text } from 'react-native'
import React, { memo, useEffect, useRef, useState } from 'react'
import { styles } from '../Dashboard.style'
import { Camera, Images, LineLayer, LocationPuck, MapView, ShapeSource, SymbolLayer } from '@rnmapbox/maps'
import { isValidLocation } from '@utils/location.utils'
import { useCurrentLocation } from '@hooks/useCurrentLocation'
import { useSelector } from 'react-redux'
import { RootState } from '@store/rootReducer'
import { getMapboxRoute } from '../../../../services/location/location.service'

const MapComponent = () => {

const { booking } = useSelector((state: RootState) => state.booking);
    const cameraRef = useRef<any>(null);
      const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const userLocation = useCurrentLocation();



  /* ================= ROUTE ================= */
  useEffect(() => {
    if (
      isValidLocation(booking?.pickup?.coordinates) &&
      isValidLocation(booking?.delivery?.coordinates)
    ) {
      const fetchAutomatedRoute = async () => {
      const geometry = await getMapboxRoute(
       booking?.pickup?.coordinates,
       booking?.delivery?.coordinates
      );
      if (geometry) {
        // setRouteGeoJSON(geometry);
        setRouteGeoJSON({
        type: 'Feature',
        properties: {},
        geometry,
      });
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

    const hasPickup = isValidLocation(booking?.pickup?.coordinates);
    const hasDrop = isValidLocation(booking?.delivery?.coordinates);

    // ✅ BOTH → FIT ROUTE
    if (hasPickup && hasDrop) {
      cameraRef.current.fitBounds(
        [booking.pickup.coordinates.lng, booking.pickup.coordinates.lat],
        [booking.delivery.coordinates.lng, booking.delivery.coordinates.lat],
        80,
        1200,
      );
      return;
    }

    // ✅ ONLY PICKUP
    if (hasPickup) {
      cameraRef.current.setCamera({
        centerCoordinate: [
          booking.pickup.coordinates.lng,
          booking.pickup.coordinates.lat,
        ],
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
          booking.delivery.coordinates.lng,
          booking.delivery.coordinates.lat,
        ],
        zoomLevel: 16,
        pitch: 45,
        animationMode: 'easeTo',
        animationDuration: 1000,
      });
      return;
    }

    // 🔥 INITIAL CURRENT LOCATION (FIXED)
    if (userLocation) {
      cameraRef.current.setCamera({
        centerCoordinate: [userLocation.lng, userLocation.lat],
        zoomLevel: 17,
        pitch: 40,
        animationMode: 'easeTo',
        animationDuration: 1000,
      });
    }
  }, [
    booking?.pickup?.coordinates,
    booking?.delivery?.coordinates,
    userLocation,
  ]);
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
          {isValidLocation(booking?.pickup?.coordinates) && (
            <ShapeSource
              id="pickupSource"
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [
                    booking.pickup.coordinates.lng,
                    booking.pickup.coordinates.lat,
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
          {isValidLocation(booking?.delivery?.coordinates) && (
            <ShapeSource
              id="dropSource"
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [
                    booking.delivery.coordinates.lng,
                    booking.delivery.coordinates.lat,
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
  )
}

export default memo(MapComponent)