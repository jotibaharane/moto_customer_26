import CustomButton from '@components/Button';
import { useDistance } from '@hooks/useDistance';
import { navigate } from '@navigation/NavigationService';
import CustomerSocket from '@socket/CustomerSocket';
import { RootState } from '@store/rootReducer';
import { setSelectedDriver } from '@store/slices/Booking/bookingSlice';
import { MapPin } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
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
  const { pickup, delivery, vehicleType, weight ,selectedDriverId} = useSelector(
    (state: RootState) => state.booking,
  );
  const { distance, loading } = useDistance(
    { lat: pickup?.latitude, lng: pickup?.longitude },
    { lat: delivery?.latitude, lng: delivery?.longitude },
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
          pickup.latitude,
          pickup.longitude,
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
        data={drivers || []}
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
          const isSelected = item?.driverId===selectedDriverId;

          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => {
                dispatch(
                  setSelectedDriver({
                    driverId: item.driverId,
                    vehicleType: item.vehicleType,
                    vehicleNumber: item.vehicleNumber,
                    vehicleImage: item.vehicleImage,

                    freightAmount: item.freightAmount,
                    expectedVehicleAvailability:
                      item.expectedVehicleAvailability,
                    distance: item.distance,
                  }),
                );
              }}
            >
              <TouchableOpacity
                onPress={() => navigate('VehicleDhalaSizeScreen', { item })}
              >
                <Image
                  source={{ uri: item?.vehicleImage }}
                  style={styles.image}
                />
              </TouchableOpacity>

              <View style={styles.cardContent}>
                <Text style={styles.vehicleName}>{item?.vehicleType}</Text>
                <Text style={styles.vehicleDetails}>
                  {item?.weightRange} , {item?.expectedVehicleAvailability}
                  {'\n'} Freight - {item?.freightAmount} ₹
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
          // navigate('VehicleDhalaSizeScreen', { item: {} });
          // if (!isFormValid) {
          //   Alert.alert('All Fields Mandetory');
          //   return;
          // }
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
