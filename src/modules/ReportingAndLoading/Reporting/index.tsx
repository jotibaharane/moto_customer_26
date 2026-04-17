import { useGetLoadPostsQuery } from '@api/Mutations';

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
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import { isValidLocation } from '@utils/location.utils';
import { Phone, User } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import { styles } from './reporting.style';

const ReportingScreen = () => {
  const cameraRef = useRef<any>(null);
  const { driverMobile, distance_km, eta_minutes, loadId } = useSelector(
    (state: RootState) => state.tracking,
  );
  const handleCall = () => {
    if (!driverMobile) return;
    Linking.openURL(`tel:${driverMobile}`);
  };
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

  // 🔥 Smooth easing
  const easeInOut = (t: number) => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  // 🔥 Smooth marker animation
  const animateMarker = (from: [number, number], to: [number, number]) => {
    const distance = Math.sqrt(
      Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2),
    );

    const duration = Math.min(Math.max(distance * 50000, 500), 1500);

    const start = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = easeInOut(Math.min((now - start) / duration, 1));

      const lng = from[0] + (to[0] - from[0]) * progress;
      const lat = from[1] + (to[1] - from[1]) * progress;

      setAnimatedCoords([lng, lat]);

      if (progress < 1) requestAnimationFrame(animate);
    };

    animate();
  };

  // 🔥 Smooth heading (fix reverse rotation)
  const getSmoothHeading = (prev: number, next: number) => {
    let diff = next - prev;

    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    return prev + diff;
  };

  // 🚗 DRIVER UPDATE
  useEffect(() => {
    if (!driver) return;

    const newCoords: [number, number] = [
      Number(driver.lng),
      Number(driver.lat),
    ];

    // First time
    if (!prevCoords.current) {
      prevCoords.current = newCoords;
      setAnimatedCoords(newCoords);
      return;
    }

    // Animate marker
    animateMarker(prevCoords.current, newCoords);
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

    const fetchRoute = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${driver.lng},${driver.lat};${pickup.lng},${pickup.lat}?access_token=${Config.MAPBOX_ACCESS_TOKEN}&geometries=geojson&overview=full&steps=true`;

        const res = await fetch(url);
        const data = await res.json();

        const coords = data.routes[0].geometry.coordinates;

        setRouteGeoJSON({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coords,
          },
        });
      } catch (e) {
        console.log('Route error', e);
      }
    };

    fetchRoute();
  }, [pickup, driver]);

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
          <Camera
            ref={cameraRef}
            followUserLocation={true}
            followZoomLevel={17}
            followPitch={40}
          />

          {/* ✅ USER LOCATION (BLUE DOT / PUCK) */}
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

          {/* 🚗 DRIVER */}
          {/* {animatedCoords && (
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
          )} */}

          {animatedCoords && (
            <MarkerView coordinate={animatedCoords}>
              <View style={{ alignItems: 'center' }}>
                {/* 🔴 POPOVER */}
                <View
                  style={{
                    backgroundColor: '#fff',
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    marginBottom: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600' }}>
                    Distance {distance_km || 0} Km
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    Time {eta_minutes || 0} min
                  </Text>
                </View>

                {/* 🚗 VEHICLE ICON */}
                <Image
                  source={require('@assets/images/carIcon.png')}
                  style={{
                    width: 40,
                    height: 40,
                    transform: [{ rotate: `${prevHeading.current}deg` }],
                  }}
                  resizeMode="contain"
                />
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
        </MapView>
      </View>

      {/* <BottomCard /> */}
      {loadId && (
        <TouchableOpacity
          style={{
            padding: fp(5),
            backgroundColor: COLORS.white[100],
            borderRadius: fp(50),
            height: hp(80),
            width: wp(80),
            position: 'absolute',
            bottom: hp(20),
            left: 10,
            borderWidth: 2,
            borderColor: COLORS.primary[500],
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          onPress={handleCall}
        >
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <View style={{ transform: [{ rotate: '45deg' }] }}>
              <Phone size={36} color={COLORS.primary[500]} />
            </View>
            <View
              style={{
                height: 26,
                width: 26,
                backgroundColor: COLORS.gray[100],
                borderRadius: fp(50),
                padding: 2,
              }}
            >
              <User />
            </View>
          </View>

          <Text style={{ fontSize: fp(8), fontFamily: FONT_FAMILIES.semiBold }}>
            Post id {loadId || 'N/A'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ReportingScreen;
