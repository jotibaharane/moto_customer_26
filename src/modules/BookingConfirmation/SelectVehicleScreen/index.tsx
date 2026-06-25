import CustomButton from '@components/Button';
import { useDistance } from '@hooks/useDistance';
import { navigate } from '@navigation/NavigationService';
import { RootState } from '@store/rootReducer';
import { MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropModal from '../Dashboard/components/DropModal';
import PickupModal from '../Dashboard/components/PickupModal';
import WeightModal from '../Dashboard/components/WeightModal';
import { styles } from './SelectVehicle.styles';

const SelectVehicleScreen = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [dropModalVisible, setDropModalVisible] = useState(false);
  const {  pickup, delivery, vehicleType,weight} = useSelector((state: RootState) => state.booking);
  const { distance, loading } = useDistance(
    {lat:pickup?.latitude,lng:pickup?.longitude},
    {lat:delivery?.latitude,lng:delivery?.longitude},
  );

  // useEffect(() => {
  //   if (!pickup || !vehicle?.approximateWeightKg) return;
  //   emitCustomerLocation(
  //     pickup?.coordinates?.lat!,
  //     pickup?.coordinates?.lng!,
  //     vehicle?.approximateWeightKg ?? 0,
  //     CustomerID,
  //   );
  // }, [pickup, weight]);
  const isFormValid =
    pickup &&
    delivery &&weight
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
              {pickup?.name || 'Select Pickup Address'}
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
              {delivery?.name || 'Select Drop Address'}
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
          Approx Weight - {weight|| 0} KG
        </Text>
      </TouchableOpacity>

      {/* Vehicle List */}
      <FlatList
        data={[]}
        
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No Vehicles Available 🚚</Text>
              <Text style={styles.emptySubText}>
                Try changing pickup location or weight to see available vehicles
              </Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => {
          const isSelected =false

          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => {
              
              }}
            >
              <TouchableOpacity
                onPress={() => navigate('VehicleDhalaSizeScreen', { item })}
              >
                {/* <Image source={{ uri: item?.Img }} style={styles.image} /> */}
              </TouchableOpacity>

              {/* <View style={styles.cardContent}>
                <Text style={styles.vehicleName}>{item?.VehicleName}</Text>
                <Text style={styles.vehicleDetails}>
                  {item?.WeightRange} , {item?.expectedVehicleAvailability} min
                  {'\n'} Freight - {item?.freight_amount} ₹
                </Text>
              </View> */}
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
          navigate('VehicleDhalaSizeScreen', { item: {} });
          if (!isFormValid) {
            Alert.alert('All Fields Mandetory');
            return;
          }
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
