import { useGetLoadPostsQuery } from '@api/Mutations';

import { getDirections } from '@api/mapbox/mapbox.api';
import MapboxGL, {
  Camera,
  LineLayer,
  LocationPuck,
  MapView,
  MarkerView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import { emitJoinRoom } from '@socket/socket.emitters';
import { RootState } from '@store/rootReducer';
import { COLORS } from '@theme/index';
import { animateMarker, getSmoothHeading } from '@utils/animation.utils';
import { handleCall } from '@utils/helperfunctions.utils';
import { isValidLocation } from '@utils/location.utils';
import { Phone, User } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import { styles } from './reporting.style';
import { navigate } from '@navigation/NavigationService';

const ReportingScreen = () => {
  const cameraRef = useRef<any>(null);
  const { driverMobile, distance_km, eta_minutes, loadId ,status} = useSelector(
    (state: RootState) => state.tracking,
  );

  const { driver, pickup, destination } = useSelector(
    (state: RootState) => state.map,
  );
  const { CustomerID } = useSelector((state: RootState) => state.auth);

  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const [animatedCoords, setAnimatedCoords] = useState<[number, number] | null>(
    null,
  );

  const prevCoords = useRef<[number, number] | null>(null);
  const prevHeading = useRef(0);

  const { data } = useGetLoadPostsQuery(
    { CustomerID: CustomerID! },
    { skip: !CustomerID },
  );

  const trips = data?.data ?? [];

  useEffect(() => {
    if (trips?.length) {
      emitJoinRoom(trips[0]?.LoadPostID);
    }
  }, [trips]);

  // 🚗 DRIVER UPDATE
  useEffect(() => {
    if (!driver) return;

    const newCoords: [number, number] = [
      Number(driver?.lng!),
      Number(driver?.lat!),
    ];

    // First time
    if (!prevCoords.current) {
      prevCoords.current = newCoords;
      setAnimatedCoords(newCoords);
      return;
    }

    // Animate marker
    animateMarker(prevCoords.current, newCoords, setAnimatedCoords);
    prevCoords.current = newCoords;

    // Smooth heading
    const smoothHeading = getSmoothHeading(
      prevHeading.current,
      driver.heading || 0,
    );

    prevHeading.current = smoothHeading;

    // 🚀 Camera follow like Uber
    cameraRef.current?.setCamera({
      centerCoordinate: newCoords,
      zoomLevel: 17,
      pitch: 60,
      heading: smoothHeading,
      animationMode: 'easeTo',
      animationDuration: 1000,
    });
  }, [driver]);

  // 🔵 ROUTE FETCH
  useEffect(() => {
    if (!pickup || !driver) return;

    const loadRoute = async () => {
      try {
        const from = [Number(driver?.lng!), Number(driver?.lat!)];
        const to = [Number(pickup?.lng!), Number(pickup?.lat!)];
        const res = await getDirections(from, to);
        if (!res) return;
        setRouteGeoJSON(res);
      } catch (e) {
        console.log('Route error', e);
      }
    };

    loadRoute();
  }, [pickup, driver]);


  useEffect(() => {
  if (status === "Loaded") {
        navigate('FrightPayment');
      }
    }, [status]);
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v12"
          logoEnabled={false}
          scaleBarEnabled={false}
        >
          {/* ✅ AUTO FOLLOW CURRENT LOCATION */}
          <Camera ref={cameraRef} />

          <LocationPuck
            puckBearingEnabled
            puckBearing="heading"
            pulsing={{ isEnabled: true }}
          />

          {/* ICONS */}
          <MapboxGL.Images
            images={{
              carIcon: require('@assets/images/carIcon.png'),
              pickupIcon: require('@assets/images/marker.png'),
              dropIcon: require('@assets/images/drop_marker.png'),
            }}
          />

          {/* 🚗 DRIVER */}
          {/* 🚗 DRIVER ICON */}
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
                  iconRotate: prevHeading?.current,
                }}
              />
            </ShapeSource>
          )}

          {/* 🔥 TOOLTIP (SEPARATE) */}
          {animatedCoords && (
            <MarkerView coordinate={animatedCoords} anchor={{ x: 0.5, y: 1.8 }}>
              <View style={styles.tooltipContainer}>
                <Text style={styles.tooltipTitle}>
                  Distance {distance_km || 0} Km
                </Text>
                <Text style={styles.tooltipText}>
                  Time {eta_minutes || 0} min
                </Text>
              </View>
            </MarkerView>
          )}

          {/* PICKUP */}
          {isValidLocation(pickup) && (
            <ShapeSource
              id="pickupSource"
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [pickup?.lng!, pickup?.lat!],
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

          {/* DROP */}
          {isValidLocation(destination) && (
            <ShapeSource
              id="dropSource"
              shape={{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [destination?.lng!, destination?.lat!],
                },
                properties: {},
              }}
            >
              <SymbolLayer
                id="dropSymbol"
                style={{
                  iconImage: 'dropIcon',
                  iconSize: 0.4,
                  iconAnchor: 'bottom',
                }}
              />
            </ShapeSource>
          )}
          {/* ROUTE */}
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
        </MapView>
      </View>

      {/* <BottomCard /> */}
      {loadId && (
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall(driverMobile)}
        >
          <View style={styles.callRows}>
            <View style={styles.phoneRotate}>
              <Phone size={36} color={COLORS.primary[500]} />
            </View>
            <View style={styles.userIconWrapper}>
              <User />
            </View>
          </View>

          <Text style={styles.postIdText} numberOfLines={1}>
            Post id {loadId || 'N/A'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ReportingScreen;
