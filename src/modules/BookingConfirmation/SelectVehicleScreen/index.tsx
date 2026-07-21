import CustomButton from '@components/Button';
import { useDistance } from '@hooks/useDistance';
import { navigate } from '@navigation/NavigationService';
import CustomerSocket from '@socket/CustomerSocket';
import { RootState } from '@store/rootReducer';
import { setSelectedDriver } from '@store/slices/Booking/bookingSlice';
import { COLORS } from '@theme/index';
import { MapPin } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropModal from '../Dashboard/components/DropModal';
import PickupModal from '../Dashboard/components/PickupModal';
import WeightModal from '../Dashboard/components/WeightModal';
import { styles } from './SelectVehicle.styles';
import VehicleCard from './component/VehicleCard';

const SelectVehicleScreen = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [dropModalVisible, setDropModalVisible] = useState(false);
  const { pickup, delivery, vehicleType, weight, selectedDriverId } =
    useSelector((state: RootState) => state.booking);
  const { distance, loading } = useDistance(
    { lat: pickup?.latitude!, lng: pickup?.longitude! },
    { lat: delivery?.latitude!, lng: delivery?.longitude! },
  );
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  console.log({ pickup, delivery });
  useEffect(() => {
    if (!pickup?.latitude || !pickup?.longitude) {
      return;
    }

    const fetchDrivers = async () => {
      try {
        setLoadingDrivers(true);

        const response = await CustomerSocket.watchDrivers(
          pickup.latitude!,
          pickup.longitude!,
          5,
        );
        setDrivers(response);
        console.log('Drivers', response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingDrivers(false);
      }
    };

    fetchDrivers();
  }, [pickup?.latitude, pickup?.longitude]);

  useEffect(() => {
    const handleDriverOnline = (driver: any) => {
      setDrivers(prev => {
        const exists = prev.some(x => x.driverId === driver.driverId);
        if (exists) {
          return prev;
        }
        return [...prev, driver];
      });
    };

    const handleDriverLocation = (driver: any) => {
      console.log('LOCATION', driver);
      setDrivers(prev =>
        prev.map(item =>
          item.driverId === driver.driverId
            ? {
                ...item,
                ...driver,
              }
            : item,
        ),
      );
    };

    const handleDriverOffline = (driver: any) => {
      console.log('OFFLINE', driver);
      setDrivers(prev =>
        prev.filter(item => item.driverId !== driver.driverId),
      );
    };
    CustomerSocket.onDriverOnline(handleDriverOnline);
    CustomerSocket.onDriverLocation(handleDriverLocation);
    CustomerSocket.onDriverOffline(handleDriverOffline);
    return () => {
      CustomerSocket.removeDriverOnline(handleDriverOnline);
      CustomerSocket.removeDriverLocation(handleDriverLocation);
      CustomerSocket.removeDriverOffline(handleDriverOffline);
    };
  }, []);
  console.log({ drivers, pickup });
  const isFormValid = pickup && delivery && weight;
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
        <Text style={styles.weightText}>Approx Weight - {weight || 0} KG</Text>
      </TouchableOpacity>

      {/* Vehicle List */}
      <FlatList
        data={drivers}
        keyExtractor={item => item.driverId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          loadingDrivers ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary[500]}
              style={{ marginTop: 50 }}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No Vehicles Available 🚚</Text>

                <Text style={styles.emptySubText}>
                  Try changing pickup location or weight.
                </Text>
              </View>
            </View>
          )
        }
        renderItem={({ item }) => (
          <VehicleCard
            item={item}
            selected={item.driverId === selectedDriverId}
            onSelect={() =>
              dispatch(
                setSelectedDriver({
                  driverId: item.driverId,
                  vehicleType: item.vehicleType,
                  vehicleNumber: item.vehicleNumber,
                  vehicleImage: item.vehicleImage,
                  freightAmount: item.freightAmount,
                  expectedVehicleAvailability: item.expectedVehicleAvailability,
                  distance: item.distance,
                }),
              )
            }
          />
        )}
      />

      {/* Button */}
      <CustomButton
        title="Confirm & Proceed"
        variant="filled"
        style={styles.button}
        onPress={() => {
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
