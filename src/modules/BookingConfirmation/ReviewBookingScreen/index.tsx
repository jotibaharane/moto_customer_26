import CustomButton from '@components/Button';
import OverlayLoader from '@components/OverlayLoader';
import { useDistance } from '@hooks/useDistance';
import CustomerSocket from '@socket/CustomerSocket';
import { RootState } from '@store/rootReducer';
import { vs } from '@theme/index';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from './ReviewBooking.style';

const ReviewBookingScreen = () => {
  const [watingDriver, setWaitingDriver] = React.useState(false);
  const { userId } = useSelector((state: RootState) => state.auth);
  const {
    delivery,
    pickup,
    vehicleType,
    weight,
    vehicleImage,
    expectedVehicleAvailability,
    freightAmount,
    selectedDriverId,
    driverMobile,
    driverName,
    vehicleNumber,
    weightRange,
  } = useSelector((state: RootState) => state.booking);
  const { distance, loading } = useDistance(
    { lat: pickup?.latitude!, lng: pickup?.longitude! },
    { lat: delivery?.latitude!, lng: delivery?.longitude! },
  );
  const handleBook = async () => {
    try {
      setWaitingDriver(true);

      CustomerSocket.sendLoadOffer({
        driverId: selectedDriverId,
        customerId: userId,
        pickup,
        delivery,
        vehicleType,
        weight,
        fare: freightAmount,
        distance: distance?.distanceKm ?? 0,
        eta: expectedVehicleAvailability,
        driverName,
        driverMobile,
        vehicleNumber,
        vehicleImage,
        weightRange,
      });
    } catch (error) {
      console.log(error);
      setWaitingDriver(false);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity activeOpacity={0.9} style={[styles.card]}>
          <Pressable style={styles.imageContainer}>
            <View style={styles.circle} />

            <Image
              source={require('@assets/images/truck.png')}
              resizeMode="contain"
              style={styles.truckImage}
            />
          </Pressable>

          <View style={styles.cardContent}>
            <View style={styles.detailRow}>
              <Text style={styles.vehicleName}>Tata Ace</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.vehicleDetails} numberOfLines={1}>
                Loading Capacity - 750 kg
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.vehicleDetails}>Length - 7 ft</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.vehicleDetails}>width - 5 ft </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.vehicleDetails}>Height - 5 ft </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Total Weight</Text>
          <Text style={styles.cardText}>{weight} KG</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Total Freight</Text>
          <Text style={styles.cardText}>{freightAmount} ₹</Text>
        </View>
        <View style={styles?.addressContainer}>
          <View style={styles.row}>
            <MapPin size={30} fill={'#4CAF50'} />
            <View>
              <Text style={styles.addressTitle}>Pick up Address</Text>
              <Text style={styles.addressSubtitle}>{pickup?.name}</Text>
            </View>
          </View>
          <View style={styles.divider}>
            <Text style={styles.distanceText}>
              {distance?.distanceKm || 0} km
            </Text>
          </View>
          <View style={styles.row}>
            <MapPin size={30} fill={'#FF0A0A'} />
            <View>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressSubtitle}>{delivery?.name}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.etaText}>
          Expated Arrival Time - {expectedVehicleAvailability}
        </Text>
        <OverlayLoader
          visible={watingDriver}
          onClose={() => {
            setWaitingDriver(false);
          }}
        />
        <CustomButton
          title="Confirm Booking"
          variant="filled"
          style={{
            marginTop: vs(49),
          }}
          onPress={handleBook}
        />
      </ScrollView>
    </View>
  );
};

export default ReviewBookingScreen;
