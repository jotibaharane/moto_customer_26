import SearchField from '@components/SearchField';
import MapboxGL, {
  Camera,
  LineLayer,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';

import { Bell } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootState } from '@store/rootReducer';
import { useSelector } from 'react-redux';

import DropModal from './components/DropModal';
import PickupModal from './components/PickupModal';
import WeightModal from './components/WeightModal';

import { useCurrentLocation } from '@hooks/useCurrentLocation';
import { isValidLocation } from '@utils/location.utils';
import Config from 'react-native-config';
import { styles } from './Dashboard.style';

const DashboardScreen = () => {
  const { booking } = useSelector((state: RootState) => state.booking);
  const cameraRef = useRef<any>(null);

  useCurrentLocation(cameraRef);

  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [dropModalVisible, setDropModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);

  /* ================= ROUTE ================= */
  useEffect(() => {
    if (
      isValidLocation(booking?.pickup?.coordinates) &&
      isValidLocation(booking?.delivery?.coordinates)
    ) {
      getRoute();
    } else {
      setRouteGeoJSON(null);
    }
  }, [booking?.pickup, booking?.delivery]);

  const getRoute = async () => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${booking?.pickup?.coordinates?.lng},${booking?.pickup?.coordinates?.lat};${booking?.delivery?.coordinates?.lng},${booking?.delivery?.coordinates?.lat}?geometries=geojson&overview=full&access_token=${Config.MAPBOX_ACCESS_TOKEN}`,
      );

      const json = await res.json();
      if (!json.routes?.length) return;

      const geometry = json.routes[0].geometry;

      // 🔥 FIX: FORCE LINE TO TOUCH MARKERS EXACTLY
      geometry.coordinates[0] = [
        booking?.pickup?.coordinates?.lng,
        booking?.pickup?.coordinates?.lat,
      ];

      geometry.coordinates[geometry.coordinates.length - 1] = [
        booking?.delivery?.coordinates?.lng,
        booking?.delivery?.coordinates?.lat,
      ];

      setRouteGeoJSON({
        type: 'Feature',
        properties: {},
        geometry,
      });
    } catch (e) {
      console.log('Route error:', e);
    }
  };

  /* ================= CAMERA ================= */
  useEffect(() => {
    const hasPickup = isValidLocation(booking?.pickup?.coordinates);
    const hasDrop = isValidLocation(booking?.delivery?.coordinates);

    if (hasPickup && hasDrop) {
      cameraRef.current?.fitBounds(
        [booking.pickup.coordinates.lng, booking.pickup.coordinates.lat],
        [booking.delivery.coordinates.lng, booking.delivery.coordinates.lat],
        80,
        1500,
      );
      return;
    }

    if (hasPickup) {
      cameraRef.current?.setCamera({
        centerCoordinate: [
          booking.pickup.coordinates.lng,
          booking.pickup.coordinates.lat,
        ],
        zoomLevel: 16,
        pitch: 45,
        animationMode: 'easeTo',
        animationDuration: 1200,
      });
    }
  }, [booking?.pickup?.coordinates, booking?.delivery?.coordinates]);

  return (
    <SafeAreaView style={styles.container}>
      {/* ================= TOP ================= */}
      <View style={styles.topWrapper}>
        <View style={styles.card}>
          <View style={styles.row}>
            <SearchField
              placeholder="Pick up Address"
              onPress={() => setPickupModalVisible(true)}
              iconColor="#4CAF50"
              editable={false}
              value={booking?.pickup?.name}
              iconType="location"
            />
            <Bell size={30} />
          </View>

          <View style={styles.row}>
            <SearchField
              placeholder="Delivery Address"
              onPress={() => setDropModalVisible(true)}
              iconColor="#FF0A0A"
              editable={false}
              value={booking?.delivery?.name}
              iconType="location"
            />
            <View style={styles.emptyBox} />
          </View>
        </View>
      </View>

      {/* ================= MAP ================= */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v12"
          scaleBarEnabled={false}
          logoEnabled={false}
        >
          <Camera ref={cameraRef} zoomLevel={16} pitch={45} />

          {/* 🚗 USER LOCATION */}
          <LocationPuck
            puckBearingEnabled
            puckBearing="heading"
            pulsing={{ isEnabled: true }}
          />

          {/* 🔥 IMAGES */}
          <MapboxGL.Images
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

      {/* ================= MODALS ================= */}
      <PickupModal open={pickupModalVisible} onOpen={setPickupModalVisible} />
      <DropModal
        open={dropModalVisible}
        onOpen={setDropModalVisible}
        setModalVisible={setModalVisible}
      />
      <WeightModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;
