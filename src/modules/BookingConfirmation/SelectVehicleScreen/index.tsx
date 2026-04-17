import CustomButton from '@components/Button';
import { useDistance } from '@hooks/useDistance';
import { navigate } from '@navigation/NavigationService';
import { emitCustomerLocation } from '@socket/socket.emitters';
import { RootState } from '@store/rootReducer';
import {
  setBookingVehicle,
  setSelectedVehicle,
} from '@store/slices/Booking/bookingSlice';
import { MapPin } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropModal from '../Dashboard/components/DropModal';
import PickupModal from '../Dashboard/components/PickupModal';
import WeightModal from '../Dashboard/components/WeightModal';
import { styles } from './SelectVehicle.styles';

const SelectVehicleScreen = () => {
  const dispatch = useDispatch();
  const { avilableVehicles } = useSelector((state: RootState) => state.booking);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [dropModalVisible, setDropModalVisible] = useState(false);
  const { booking } = useSelector((state: RootState) => state.booking);
  const { CustomerID } = useSelector((state: RootState) => state.auth);
  const { distance, loading } = useDistance(
    booking?.pickup?.coordinates,
    booking?.delivery?.coordinates,
  );

  useEffect(() => {
    if (!booking?.pickup || !booking?.vehicle?.approximateWeightKg) return;
    emitCustomerLocation(
      booking?.pickup?.coordinates?.lat!,
      booking?.pickup?.coordinates?.lng!,
      booking?.vehicle?.approximateWeightKg ?? 0,
      CustomerID,
    );
  }, [booking?.pickup, booking.vehicle?.approximateWeightKg]);
  const isFormValid =
    booking?.pickup &&
    booking?.delivery &&
    booking?.vehicle?.vehicleNo &&
    booking?.vehicle?.approximateWeightKg;
  return (
    <View style={styles.container}>
      {/* Pickup */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => setPickupModalVisible(true)}
        >
          <MapPin size={30} fill={'#4CAF50'} />
          <View>
            <Text style={styles.label}>Pick up Address</Text>
            <Text style={styles.subText}>
              {booking?.pickup?.name || 'Select Pickup Address'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Distance */}
        <View style={styles.distanceLine}>
          <Text style={styles.distanceText}>
            {loading ? 'Calculating...' : `${distance?.distanceKm || 0} km`}
          </Text>
        </View>

        {/* Drop */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setDropModalVisible(true)}
        >
          <MapPin size={30} fill={'#FF0A0A'} />
          <View>
            <Text style={styles.label}>Delivery Address</Text>
            <Text style={styles.subText}>
              {booking?.delivery?.name || 'Select Drop Address'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Weight */}
      <TouchableOpacity
        style={styles.weightBox}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.weightText}>
          Approx Weight - {booking?.vehicle?.approximateWeightKg || 0} KG
        </Text>
      </TouchableOpacity>

      {/* Vehicle List */}
      <FlatList
        data={avilableVehicles}
        keyExtractor={(item, index) => item?.DriverID + index}
        renderItem={({ item }) => {
          const isSelected =
            booking?.vehicle?.vehicleNo === item?.registration_no;

          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => {
                dispatch(setSelectedVehicle(item));
                dispatch(setBookingVehicle(item));
              }}
            >
              <TouchableOpacity
                onPress={() => navigate('VehicleDhalaSizeScreen', { item })}
              >
                <Image source={{ uri: item?.Img }} style={styles.image} />
              </TouchableOpacity>

              <View style={styles.cardContent}>
                <Text style={styles.vehicleName}>{item?.VehicleName}</Text>
                <Text style={styles.vehicleDetails}>
                  {item?.WeightRange} , {item?.expectedVehicleAvailability} min
                  {'\n'} Freight - {item?.freight_amount} ₹
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Button */}
      <CustomButton
        title="Confirm & Proceed"
        variant="filled"
        style={styles.button}
        onPress={() => {
          if (!isFormValid) {
            Alert.alert('All Fields Mandetory');
            return;
          } // extra safety
          navigate('ReviewBookingScreen');
        }}
      />

      <PickupModal open={pickupModalVisible} onOpen={setPickupModalVisible} />
      <DropModal open={dropModalVisible} onOpen={setDropModalVisible} />
      <WeightModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default SelectVehicleScreen;
