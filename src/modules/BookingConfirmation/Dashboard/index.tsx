import SearchField from '@components/SearchField';
import MapboxGL, {
  Camera,
  LineLayer,
  LocationPuck,
  MapView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootState } from '@store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';

import DropModal from './components/DropModal';
import PickupModal from './components/PickupModal';

import { useCurrentLocation } from '@hooks/useCurrentLocation';
import { navigate } from '@navigation/NavigationService';
import { setWeight } from '@store/slices/Booking/bookingSlice';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { isValidLocation } from '@utils/location.utils';
import { ArrowRight } from 'lucide-react-native';
import { styles } from './Dashboard.style';

const DashboardScreen = () => {
  const { booking } = useSelector((state: RootState) => state.booking);
  const cameraRef = useRef<any>(null);

  const dispatch = useDispatch();

  const userLocation = useCurrentLocation();

  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [dropModalVisible, setDropModalVisible] = useState(false);

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
        `https://api.mapbox.com/directions/v5/mapbox/driving/${
          booking?.pickup?.coordinates?.lng
        },${booking?.pickup?.coordinates?.lat};${
          booking?.delivery?.coordinates?.lng
        },${
          booking?.delivery?.coordinates?.lat
        }?geometries=geojson&overview=full&access_token=${'pk.eyJ1IjoicmFtZXNobW90byIsImEiOiJjbWt4c2swb2QwYzA1M2Nxemg2MzZjZG5jIn0.r9DupyA23H--LeacRtBXKA'}`,
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
              value={booking?.pickup?.fullAddress}
              iconType="location"
            />
            {/* <Bell size={30} /> */}
          </View>

          <View style={styles.row}>
            <SearchField
              placeholder="Delivery Address"
              onPress={() => {
                booking?.pickup?.name
                  ? setDropModalVisible(true)
                  : Alert.alert('Select pickup first');
              }}
              iconColor="#FF0A0A"
              editable={false}
              value={booking?.delivery?.fullAddress}
              iconType="location"
            />
            {/* <View style={styles.emptyBox} /> */}
          </View>
          <View style={styles.declare_weight_container}>
            <Text style={styles.declare_weight}>Declare Weight</Text>
            <TextInput
              placeholder="eg. 1000"
              style={styles.weight_input}
              value={booking?.vehicle?.approximateWeightKg}
              keyboardType="number-pad"
              onChangeText={i =>
                dispatch(setWeight({ approximateWeightKg: i }))
              }
            />

            <Text style={styles.kg}>Kg</Text>
          </View>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignSelf: 'flex-end' }}
            onPress={() => {
              if (
                booking?.pickup &&
                booking?.delivery &&
                booking?.vehicle?.approximateWeightKg
              ) {
                navigate('SelectVehicleScreen');
              } else {
                Alert.alert('Pickup,Drop and weight required');
              }
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: FONT_FAMILIES.bold,
                color: COLORS.primary[500],
              }}
            >
              Next
            </Text>
            <ArrowRight size={30} color={COLORS.primary[500]} />
          </TouchableOpacity>
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
          <Camera ref={cameraRef} />

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
      <DropModal open={dropModalVisible} onOpen={setDropModalVisible} />
    </SafeAreaView>
  );
};

export default DashboardScreen;
