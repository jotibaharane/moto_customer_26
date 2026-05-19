// ReportingScreen.tsx

import { useGetLoadPostsQuery } from '@api/Mutations';

import { getDirections } from '@api/mapbox/mapbox.api';

import MapboxGL, {
  Camera,
  LineLayer,
  MapView,
  MarkerView,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';

import { emitJoinRoom } from '@socket/socket.emitters';

import { RootState } from '@store/rootReducer';

import { COLORS } from '@theme/index';

import {
  animateMarker,
  getSmoothHeading,
} from '@utils/animation.utils';

import { handleCall } from '@utils/helperfunctions.utils';

import { isValidLocation } from '@utils/location.utils';

import { Phone, User } from 'lucide-react-native';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useSelector } from 'react-redux';

import Header from './components/Header';

import { styles } from './reporting.style';

import { navigate } from '@navigation/NavigationService';

const ReportingScreen = () => {
  const cameraRef = useRef<any>(null);

  // =========================
  // REDUX
  // =========================

  const { status, CustomerID } = useSelector(
    (state: RootState) => state.auth,
  );
  const { PaymentStatus} = useSelector(
    (state: RootState) => state.payment,
  );
  const {
    driverMobile,
    distance_km,
    eta_minutes,
    loadId,
  } = useSelector(
    (state: RootState) => state.tracking,
  );

  const {
    driver,
    pickup,
    destination,
  } = useSelector(
    (state: RootState) => state.map,
  );

  // =========================
  // STATES
  // =========================

  const [routeGeoJSON, setRouteGeoJSON] =
    useState<any>(null);

  const [animatedCoords, setAnimatedCoords] =
    useState<[number, number] | null>(null);

  const prevCoords = useRef<
    [number, number] | null
  >(null);

  const prevHeading = useRef(0);

  // =========================
  // LOAD POSTS
  // =========================

  const { data } = useGetLoadPostsQuery(
    { CustomerID: CustomerID! },
    { skip: !CustomerID },
  );

  const trips = data?.data ?? [];

  // =========================
  // SOCKET JOIN
  // =========================

  useEffect(() => {
    if (trips?.length) {
      emitJoinRoom(trips[0]?.LoadPostID);
    }
  }, [trips]);

  // =========================
  // DRIVER LIVE MOVEMENT
  // =========================

  useEffect(() => {
    if (!driver) return;

    const lng = Number(driver?.lng);

    const lat = Number(driver?.lat);

    // INVALID COORDS
    if (isNaN(lng) || isNaN(lat)) {
      console.log(
        'Invalid driver coordinates',
        driver,
      );

      return;
    }

    const newCoords: [number, number] = [
      lng,
      lat,
    ];

    // FIRST TIME
    if (!prevCoords.current) {
      prevCoords.current = newCoords;

      setAnimatedCoords(newCoords);

      // FOLLOW VEHICLE BEFORE START
      if (status !== 'started') {
        cameraRef.current?.setCamera({
          centerCoordinate: newCoords,

          zoomLevel: 17,

          pitch: 60,

          heading: driver.heading || 0,

          animationMode: 'easeTo',

          animationDuration: 1000,
        });
      }

      return;
    }

    // SMOOTH ANIMATION
    animateMarker(
      prevCoords.current,
      newCoords,
      setAnimatedCoords,
    );

    prevCoords.current = newCoords;

    const smoothHeading = getSmoothHeading(
      prevHeading.current,
      driver.heading || 0,
    );

    prevHeading.current = smoothHeading;

    // FOLLOW ONLY BEFORE START
    if (status !== 'started') {
      cameraRef.current?.setCamera({
        centerCoordinate: newCoords,

        zoomLevel: 17,

        pitch: 60,

        heading: smoothHeading,

        animationMode: 'easeTo',

        animationDuration: 1000,
      });
    }
  }, [driver, status]);

  // =========================
  // ROUTE FETCH
  // =========================

  useEffect(() => {
    if (!pickup || !driver) return;

    const loadRoute = async () => {
      try {
        // BEFORE START
        // DRIVER -> PICKUP

        const from =
          status === 'started'
            ? [
                Number(pickup?.lng),
                Number(pickup?.lat),
              ]
            : [
                Number(driver?.lng),
                Number(driver?.lat),
              ];

        // AFTER START
        // PICKUP -> DESTINATION

        const to =
          status === 'started'
            ? [
                Number(destination?.lng),
                Number(destination?.lat),
              ]
            : [
                Number(pickup?.lng),
                Number(pickup?.lat),
              ];

        const res = await getDirections(
          from,
          to,
        );

        if (!res) return;

        // SET ROUTE
        setRouteGeoJSON(res);

        // =========================
        // FULL ROUTE AFTER START
        // =========================

        if (status === 'started') {
          const coords =
            res?.geometry?.coordinates;

          if (!coords?.length) return;

          const lats = coords.map(
            (c: any) => c[1],
          );

          const lngs = coords.map(
            (c: any) => c[0],
          );

          const ne: [number, number] = [
            Math.max(...lngs),
            Math.max(...lats),
          ];

          const sw: [number, number] = [
            Math.min(...lngs),
            Math.min(...lats),
          ];

          // SHOW FULL ROUTE
          cameraRef.current?.fitBounds(
            ne,
            sw,
            120,
            1000,
          );
        }
      } catch (e) {
        console.log('Route error', e);
      }
    };

    loadRoute();
  }, [
    pickup,
    driver,
    destination,
    status,
  ]);

  // =========================
  // NAVIGATION
  // =========================

  useEffect(() => {
    if ((status === 'loaded'||status==="reached")&&PaymentStatus!=="FULL") {
      navigate('FrightPayment');
    }
  }, [status]);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Header />

      {/* MAP */}
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
          <MapboxGL.Images
            images={{
              carIcon: require(
                '@assets/images/carIcon.png',
              ),

              pickupIcon: require(
                '@assets/images/marker.png',
              ),

              dropIcon: require(
                '@assets/images/drop_marker.png',
              ),
            }}
          />

          {/* ========================= */}
          {/* ROUTE */}
          {/* ========================= */}

          {routeGeoJSON && (
            <ShapeSource
              id="routeSource"
              shape={routeGeoJSON}
            >
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

                  coordinates:
                    animatedCoords,
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

                  iconRotationAlignment:
                    'map',

                  iconAllowOverlap: true,

                  iconRotate:
                    prevHeading.current,
                }}
              />
            </ShapeSource>
          )}

          {/* ========================= */}
          {/* TOOLTIP */}
          {/* ========================= */}

          {animatedCoords && (
            <MarkerView
              coordinate={animatedCoords}
              anchor={{ x: 0.5, y: 1.8 }}
            >
              <View
                style={styles.tooltipContainer}
              >
                <Text
                  style={styles.tooltipTitle}
                >
                  Distance{' '}
                  {distance_km || 0} Km
                </Text>

                <Text
                  style={styles.tooltipText}
                >
                  Time {eta_minutes || 0} min
                </Text>
              </View>
            </MarkerView>
          )}

          {/* ========================= */}
          {/* PICKUP */}
          {/* ========================= */}

          {isValidLocation(pickup) && (
            <ShapeSource
              id="pickupSource"
              shape={{
                type: 'Feature',

                geometry: {
                  type: 'Point',

                  coordinates: [
                    Number(pickup?.lng),
                    Number(pickup?.lat),
                  ],
                },

                properties: {},
              }}
            >
              <SymbolLayer
                id="pickupSymbol"
                style={{
                  iconImage:
                    'pickupIcon',

                  iconSize: 0.3,

                  iconAnchor: 'bottom',
                }}
              />
            </ShapeSource>
          )}

          {/* ========================= */}
          {/* DESTINATION */}
          {/* ========================= */}

          {status === 'started' &&
            isValidLocation(
              destination,
            ) && (
              <ShapeSource
                id="dropSource"
                shape={{
                  type: 'Feature',

                  geometry: {
                    type: 'Point',

                    coordinates: [
                      Number(
                        destination?.lng,
                      ),

                      Number(
                        destination?.lat,
                      ),
                    ],
                  },

                  properties: {},
                }}
              >
                <SymbolLayer
                  id="dropSymbol"
                  style={{
                    iconImage:
                      'dropIcon',

                    iconSize: 0.4,

                    iconAnchor:
                      'bottom',
                  }}
                />
              </ShapeSource>
            )}
        </MapView>
      </View>

      {/* ========================= */}
      {/* CALL BUTTON */}
      {/* ========================= */}

      {loadId && (
        <TouchableOpacity
          style={styles.callButton}
          onPress={() =>
            handleCall(driverMobile)
          }
        >
          <View style={styles.callRows}>
            <View
              style={styles.phoneRotate}
            >
              <Phone
                size={36}
                color={
                  COLORS.primary[500]
                }
              />
            </View>

            <View
              style={
                styles.userIconWrapper
              }
            >
              <User />
            </View>
          </View>

          <Text
            style={styles.postIdText}
            numberOfLines={1}
          >
            Post id {loadId || 'N/A'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ReportingScreen;