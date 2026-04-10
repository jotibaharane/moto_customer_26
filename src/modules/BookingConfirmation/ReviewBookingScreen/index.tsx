import {
  useCreateLoadPostMutation,
  useUpdateLoadPostMutation,
} from '@api/Mutations';
import CustomButton from '@components/Button';
import { useDistance } from '@hooks/useDistance';
import { goBack, navigate } from '@navigation/NavigationService';
import { emitCreateCustomerLoad } from '@socket/socket.emitters';
import { RootState } from '@store/rootReducer';
import {
  resetBooking,
  setDriverStates,
  setLoadPost,
} from '@store/slices/Booking/bookingSlice';
import { hp, wp } from '@theme/index';
import { formatTime } from '@utils/datetime.utils';
import {
  transformBookingPayload,
  transformSocketLocation,
} from '@utils/transform.utils';
import { MapPin } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import WaitingDriver from './components/WaitingDriver';
import { styles } from './ReviewBooking.style';

const ReviewBookingScreen = () => {
  const [watingDriver, setWaitingDriver] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(30);
  const dispatch = useDispatch();
  const { booking, bookingVehicle, isConfirmed, DriverID } = useSelector(
    (state: RootState) => state.booking,
  );

  console.log({ booking });
  const customerId = useSelector((state: RootState) => state?.auth?.CustomerID);

  const [createLoadPost, { isLoading }] = useCreateLoadPostMutation();
  const [updateLoadPost, { isLoading: updateLoading }] =
    useUpdateLoadPostMutation();
  const { distance, loading } = useDistance(
    booking?.pickup?.coordinates,
    booking?.delivery?.coordinates,
  );

  useEffect(() => {
    if (isConfirmed?.loadstatus === 'accepted') {
      navigate('BottomNavigation', {
        screen: 'New Load',
      });
      dispatch(resetBooking());
      setWaitingDriver(false);
    } else if (isConfirmed?.loadstatus === 'rejected') {
      setWaitingDriver(false);
      dispatch(setDriverStates({ ...isConfirmed, loadstatus: 'waiting' }));
      goBack();
    }
  }, [isConfirmed?.loadstatus]);

  useEffect(() => {
    let timer: any;
    if (watingDriver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [watingDriver, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      goBack();
      setWaitingDriver(false);
    }
  }, [watingDriver, timeLeft]);

  const handleBook = async () => {
    try {
      const payload = transformBookingPayload(booking, customerId);
      const resp =
        booking?.LoadPost_ID !== ''
          ? await updateLoadPost({
              ...payload,
              LoadPost_ID: booking?.LoadPost_ID,
            }).unwrap()
          : await createLoadPost(payload).unwrap();

      if (resp.status === '00') {
        dispatch(
          setLoadPost({
            LoadPost_ID: resp?.data?.LoadPostID || booking?.LoadPost_ID,
          }),
        );
        const socketPayload = transformSocketLocation(
          booking,
          resp?.data?.LoadPostID || booking?.LoadPost_ID,
          distance,
          DriverID,
          customerId,
        );
        emitCreateCustomerLoad(socketPayload);
        setWaitingDriver(true);
        setTimeLeft(30);
      } else {
        Alert.alert(resp?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.vehicleCard}>
          <Image
            source={{ uri: bookingVehicle?.Img }}
            height={hp(150)}
            width={wp(150)}
          />
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleTitle}>
              {bookingVehicle?.VehicleName}
            </Text>
            <Text style={styles.vehicleInfo}>
              Loading Capacity - {bookingVehicle?.unladen_weight}kg{'\n\n'}
              Length -{bookingVehicle?.length}ft{'\n\n'}
              width - {bookingVehicle?.width} ft{'\n\n'}
              Height - {bookingVehicle?.height} ft
            </Text>
          </View>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Total Weight</Text>
          <Text style={styles.cardText}>
            {bookingVehicle?.vehicle_gross_weight} KG
          </Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Total Freight</Text>
          <Text style={styles.cardText}>{booking?.load?.freight_amount} ₹</Text>
        </View>
        <View style={styles?.addressContainer}>
          <View style={styles.row}>
            <MapPin size={30} fill={'#4CAF50'} />
            <View>
              <Text style={styles.addressTitle}>Pick up Address</Text>
              <Text style={styles.addressSubtitle}>
                {booking?.pickup?.name}
              </Text>
            </View>
          </View>
          <View style={styles.divider}>
            <Text style={styles.distanceText}>
              {loading ? 'Calculating...' : `${distance?.distanceKm || 0} km`}
            </Text>
          </View>
          <View style={styles.row}>
            <MapPin size={30} fill={'#FF0A0A'} />
            <View>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressSubtitle}>
                {booking?.delivery?.name}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.etaText}>
          Expated Arrival Time -{' '}
          {Math.round(distance?.durationMin! / 60) > 0 &&
            `${Math.round(distance?.durationMin! / 60)} hr`}{' '}
          {`${distance?.durationMin! % 60} min`}
        </Text>
        {watingDriver && <WaitingDriver timer={formatTime(timeLeft)} />}
        <CustomButton
          title="Confirm Booking"
          variant="filled"
          style={{ marginTop: hp(49) }}
          onPress={handleBook}
          loading={isLoading || updateLoading}
        />
      </ScrollView>
    </View>
  );
};

export default ReviewBookingScreen;
