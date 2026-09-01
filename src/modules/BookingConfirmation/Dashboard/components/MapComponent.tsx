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
import { isValidLocation } from '@utils/location.utils';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getMapboxRoute } from '../../../../services/location/location.service';
import { styles } from '../Dashboard.style';
import CustomModal from '@components/Modals/CustumModal';
import BookingCard from '@components/Cards/BookingCard';
import Dropdown, {Item} from '@components/Dropdown';
const MapComponent = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState<Location>();
  const booking = useSelector((state: RootState) => state.booking);
  const cameraRef = useRef<any>(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
      const [loadPostNo, setLoadPostNo] = useState('');
      const handleOpenBooking = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setModalVisible(false);
  }, []);
  // const { location } = useCurrentLocation();


const loadPosts: Item[] = [
  {label: 'LP001', value: 'LP001'},
  {label: 'LP002', value: 'LP002'},
  {label: 'LP003', value: 'LP003'},
];
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
  return (
    <View style={styles.mapContainer}>
      {/* <MapView
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

        <Images
          images={{
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
                iconSize: 0.25,
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
                iconAnchor: 'bottom', 
              }}
            />
          </ShapeSource>
        )}

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
                iconAnchor: 'bottom',
              }}
            />
          </ShapeSource>
        )}
      </MapView> */}
      <CustomModal
        visible={modalVisible}
        onClose={handleCloseBooking}
        closeOnBackdropPress={true}
          width={94}>
            
 <Dropdown
      label="Load Post No"
      data={loadPosts}
      value={loadPostNo}
      onChange={value => {
        setLoadPostNo(value as string);
      }}
      placeholder="Select Load Post No"
      searchPlaceholder="Search Load Post No..."
      emptyMessage="No load posts found"
    />
        <BookingCard
          loadId={booking?.loadId ?? 'ABC12345566'}
          pickupDistance="05 km"
          pickupAddress={
            booking?.pickup?.address ??
            'Bhandup Mumbai, Maharashtra, India'
          }
          deliveryAddress={
            booking?.delivery?.address ??
            'Rajkot Mandvi, Gujarat, India'
          }
          distance={`${booking?.distance ?? 250} km`}
          approxWeight={`${booking?.approxWeight ?? 10000} KG`}
          freightAmount={`RS ${booking?.freightAmount ?? 10000}`}
          vehicleNo={booking?.vehicleNo}
          driverName={booking?.driverName}
          driverId={booking?.driverId}
          onCancel={() => {
            console.log('Cancel Booking');
            handleCloseBooking();
          }}
        />

      </CustomModal>

      <TouchableOpacity
  onPress={handleOpenBooking}
  style={{
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
  }}>
  <Text style={{color: '#fff'}}>Open Booking</Text>
</TouchableOpacity>
    </View>
  );
};

export default memo(MapComponent);
