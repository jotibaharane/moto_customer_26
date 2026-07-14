import CustomButton from '@components/Button';
import OverlayLoader from '@components/OverlayLoader';
import CustomerSocket from '@socket/CustomerSocket';
import { RootState } from '@store/rootReducer';
import { s, vs } from '@theme/index';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from './ReviewBooking.style';
import { useDistance } from '@hooks/useDistance';

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
    { lat: pickup?.latitude, lng: pickup?.longitude },
    { lat: delivery?.latitude, lng: delivery?.longitude },
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
        <View style={styles.vehicleCard}>
          <Image source={{ uri: vehicleImage }} height={150} width={150} />
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleTitle}>{vehicleNumber}</Text>
            {/* <Text style={styles.vehicleInfo}>
              Loading Capacity - {bookingVehicle?.unladen_weight}kg{'\n\n'}
              Length -{bookingVehicle?.length}ft{'\n\n'}
              width - {bookingVehicle?.width} ft{'\n\n'}
              Height - {bookingVehicle?.height} ft
            </Text> */}
          </View>
        </View>
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
            <Text style={styles.distanceText}>{distance?.distanceKm || 0} km</Text>
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
            alignSelf: 'center',
            paddingHorizontal: s(40),
          }}
          onPress={handleBook}
        />
      </ScrollView>
    </View>
  );
};

export default ReviewBookingScreen;
