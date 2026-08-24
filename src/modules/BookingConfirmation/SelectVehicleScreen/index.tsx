import CustomButton from '@components/Button';
import { useDistance } from '@hooks/useDistance';
import { navigate } from '@navigation/NavigationService';
import CustomerSocket from '@socket/CustomerSocket';
import { RootState } from '@store/rootReducer';
import { setSelectedDriver } from '@store/slices/Booking/bookingSlice';
import { IconMapPinFilled } from '@tabler/icons-react-native';
import { COLORS } from '@theme/index';
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
import { clearNearbyDrivers } from '@store/slices/customerSocket/customerSocketSlice';
const SelectVehicleScreen = () => {
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] =
    useState(false);

  const [pickupModalVisible, setPickupModalVisible] =
    useState(false);

  const [dropModalVisible, setDropModalVisible] =
    useState(false);

  const {
    pickup,
    delivery,
    weight,
    selectedDriverId,
  } = useSelector(
    (state: RootState) => state.booking,
  );

  const {
    nearbyDrivers,
    watchingRadius,
  } = useSelector(
    (state: RootState) => state.customerSocket,
  );

  const {
    distance,
    loading: distanceLoading,
  } = useDistance(
    {
      lat: pickup?.latitude!,
      lng: pickup?.longitude!,
    },
    {
      lat: delivery?.latitude!,
      lng: delivery?.longitude!,
    },
  );

  const [loadingDrivers, setLoadingDrivers] =
    useState(false);

  /**
   * Watch nearby drivers
   */
  useEffect(() => {
    if (
      pickup?.latitude == null ||
      pickup?.longitude == null
    ) {
      return;
    }

    const watchDrivers = async () => {
      try {
        setLoadingDrivers(true);

        /**
         * Clear old drivers first.
         */
        dispatch(clearNearbyDrivers());

        await CustomerSocket.watchDrivers(
          pickup.latitude??0,
          pickup.longitude??0,
          watchingRadius,
          weight ?? 0,
        );
      } catch (error) {
        console.error(
          'Failed to watch nearby drivers:',
          error,
        );
      } finally {
        setLoadingDrivers(false);
      }
    };

    watchDrivers();
  }, [
    pickup?.latitude,
    pickup?.longitude,
    weight,
    watchingRadius,
    dispatch,
  ]);
   const isFormValid =
    Boolean(
      pickup &&
      delivery &&
      weight,
    );
console.log({nearbyDrivers})
  return (
    <View style={styles.container}>

      {/* Pickup */}
      <View style={styles.section}>

        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            setPickupModalVisible(true)
          }
        >
          <IconMapPinFilled
            size={30}
            fill="#4CAF50"
          />

          <View>
            <Text style={styles.label}>
              Pick up Address
            </Text>

            <Text style={styles.subText}>
              {pickup?.name ||
                'Select Pickup Address'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Distance */}
        <View style={styles.distanceLine}>
          <Text style={styles.distanceText}>
            {distanceLoading
              ? 'Calculating...'
              : `${distance?.distanceKm ?? 0} km`}
          </Text>
        </View>

        {/* Drop */}
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            setDropModalVisible(true)
          }
        >
          <IconMapPinFilled
            size={30}
            fill="#FF0A0A"
          />

          <View>
            <Text style={styles.label}>
              Delivery Address
            </Text>

            <Text style={styles.subText}>
              {delivery?.name ||
                'Select Drop Address'}
            </Text>
          </View>
        </TouchableOpacity>

      </View>

      {/* Weight */}
      <TouchableOpacity
        style={styles.weightBox}
        onPress={() =>
          setModalVisible(true)
        }
      >
        <Text style={styles.weightText}>
          Approx Weight - {weight ?? 0} KG
        </Text>
      </TouchableOpacity>

      {/* Nearby Drivers */}
      <FlatList
        data={nearbyDrivers}
        keyExtractor={item =>
          item?.driverId
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.listContainer
        }
        ItemSeparatorComponent={() => (
          <View style={{ height: 16 }} />
        )}
        ListEmptyComponent={
          loadingDrivers ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary[500]}
              style={{
                marginTop: 50,
              }}
            />
          ) : (
            <View
              style={styles.emptyContainer}
            >
              <View
                style={styles.emptyCard}
              >
                <Text
                  style={styles.emptyTitle}
                >
                  No Vehicles Available 🚚
                </Text>

                <Text
                  style={
                    styles.emptySubText
                  }
                >
                  Try changing pickup
                  location or weight.
                </Text>
              </View>
            </View>
          )
        }
        renderItem={({ item }) => (
          <VehicleCard
            item={item}
            selected={
              item.driverId ===
              selectedDriverId
            }
          onSelect={() => {
  dispatch(
    setSelectedDriver({


  
        
      
        width:item?.vehicle?.dhalaWidth,
        height:item?.vehicle?.dhalaHeight,
        length:item?.vehicle?.dhalaLength,
        freightAmount: 1000,
        distance: 250,


      driverId: item.driverId,


      vehicleType:
        item.vehicle.vehicleType,

      vehicleNumber:
        item.vehicle.vehicleNo,

      vehicleImage:
        item.vehicle.cardImage as string,

      weightRange:
        `${item.vehicle.minLoadingCapacity}-${item.vehicle.maxLoadingCapacity} ${item.vehicle.capacityUnit}`,

      expectedVehicleAvailability:
        item?.etaMinutes?.toString(),
    }),
  );
}}
          />
        )}
      />

      {/* Button */}
      <CustomButton
        title="Confirm & Proceed"
        variant="filled"
    
        onPress={() => {
          navigate(
            'ReviewBookingScreen',
          );
        }}
      />

      <PickupModal
        open={pickupModalVisible}
        onOpen={
          setPickupModalVisible
        }
      />

      <DropModal
        open={dropModalVisible}
        onOpen={
          setDropModalVisible
        }
      />

      <WeightModal
        modalVisible={modalVisible}
        setModalVisible={
          setModalVisible
        }
      />
    </View>
  );
};


export default SelectVehicleScreen;
