
import SearchField from '@components/SearchField';
import { navigate } from '@navigation/NavigationService';
import { RootState } from '@store/rootReducer';
import { setDeclaredValueAmount, setDeclareValue, setWeight } from '@store/slices/Booking/bookingSlice';
import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './Dashboard.style';

import DropModal from './components/DropModal';
import MapComponent from './components/MapComponent';
import PickupModal from './components/PickupModal';

// Update this import according to your actual file location
import LoadStatusModal from '@modules/BookingConfirmation/Dashboard/components/LoadStatusModal';

type LoadStatus =
  | 'REPORTED'
  | 'LOADING'
  | 'LOADED'
  | 'PAYMENT'
  | 'COMPLETED';

const DashboardScreen = () => {
  const { pickup, delivery, weight,declareValue ,declaredValueAmount} = useSelector(
    (state: RootState) => state.booking,
  );

  const dispatch = useDispatch();

  // Existing modal states
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [dropModalVisible, setDropModalVisible] = useState(false);

  // Load status modal states
  const [loadStatusModalVisible, setLoadStatusModalVisible] =
    useState(false);

  const [loadStatus, setLoadStatus] =
    useState<LoadStatus>('REPORTED');

  // Handle load status changes
  const handleStatusChange = (newStatus: LoadStatus) => {
    console.log('Load Status Changed:', newStatus);

    setLoadStatus(newStatus);
  };

  // Close load status modal
  const handleCloseLoadStatusModal = () => {
    setLoadStatusModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ================= TOP ================= */}

      {(!pickupModalVisible || !dropModalVisible) && (
        <View style={styles.topWrapper}>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <SearchField
                  placeholder="Pick up Address"
                  onPress={() => setPickupModalVisible(true)}
                  iconColor="#4CAF50"
                  editable={false}
                  value={pickup?.fullAddress}
                  iconType="location"
                />
              </View>
            </View>

            {pickup?.fullAddress && (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <SearchField
                    placeholder="Delivery Address"
                    onPress={() => {
                      pickup?.name
                        ? setDropModalVisible(true)
                        : Alert.alert('Select pickup first');
                    }}
                    iconColor="#FF0A0A"
                    editable={false}
                    value={delivery?.fullAddress}
                    iconType="location"
                  />
                </View>
              </View>
            )}

            {pickup?.fullAddress && delivery?.fullAddress && (
              <>
                {/* <View style={styles.declare_weight_container}>
                  <Text style={styles.declare_weight}>
                    Declare Weight
                  </Text>

                  <TextInput
                    placeholder="eg. 1000"
                    style={styles.weight_input}
                    value={weight?.toString()}
                    keyboardType="number-pad"
                    onChangeText={i =>
                      dispatch(setWeight({ weight: i }))
                    }
                  />

                  <Text style={styles.kg}>Kg</Text>
                </View> */}
{/* Declare Weight */}
<View style={styles.declare_weight_container}>
  <Text style={styles.declare_weight} numberOfLines={1}>
    Declare Weight
  </Text>

  <View style={{ width: s(58) }} />

  <TextInput
    placeholder="eg. 1000"
    style={styles.weight_input}
    value={weight ? weight.toLocaleString('en-IN') : ''}
    keyboardType="number-pad"
    onChangeText={value =>
      dispatch(setWeight({ weight: value.replace(/\D/g, '') }))
    }
  />

  <Text style={styles.kg}>Kg</Text>
</View>

{/* Declare Value */}
<View style={styles.declare_weight_container}>
  <Text style={styles.declare_weight} numberOfLines={1}>
    Declare Value
  </Text>

  <TouchableOpacity
    onPress={() => dispatch(setDeclareValue(!declareValue))}
    style={{
      width: s(58),
      flexDirection: 'row',
      alignItems: 'center',
      gap: s(5),
    }}
  >
    <View
      style={{
        width: s(18),
        height: s(18),
        borderRadius: s(9),
        borderWidth: 2,
        borderColor: declareValue ? COLORS.primary[500] : '#999',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {declareValue && (
        <View
          style={{
            width: s(9),
            height: s(9),
            borderRadius: s(5),
            backgroundColor: COLORS.primary[500],
          }}
        />
      )}
    </View>
    <Text style={{ fontSize: ms(12) }}>Yes</Text>
  </TouchableOpacity>

  <TextInput
    placeholder="eg. 20000"
    style={[
      styles.weight_input,
      { opacity: declareValue ? 1 : 0.5 },
    ]}
    value={
      declareValue && declaredValueAmount
        ? declaredValueAmount.toLocaleString('en-IN')
        : ''
    }
    editable={declareValue}
    keyboardType="number-pad"
    onChangeText={value =>
      dispatch(
        setDeclaredValueAmount(
          Number(value.replace(/\D/g, '')) || 0,
        ),
      )
    }
  />

  <Text style={styles.kg}>₹</Text>
</View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                  }}
                 onPress={() => {
  if (!weight || Number(weight) <= 0) {
    Alert.alert(
      'Weight required',
      'Please enter shipment weight.',
    );
    return;
  }

  navigate('SelectVehicleScreen');
}}
                  // onPress={() => {
                  //   if (!weight || Number(weight) <= 0) {
                  //     Alert.alert(
                  //       'Weight required',
                  //       'Please enter the shipment weight before continuing.',
                  //     );
                  //     return;
                  //   }

                  //   navigate('SelectVehicleScreen');
                  // }}
                >
                  <Text
                    style={{
                      fontSize: ms(18),
                      fontFamily: FONT_FAMILIES.bold,
                      color: COLORS.primary[500],
                    }}
                  >
                    Next
                  </Text>

                  <Text style={{ color: COLORS.primary[500] }}>
                    →
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}

      {/* ================= MAP ================= */}

      <View
        style={{
          padding: vs(16),
          flex: 1,
          borderRadius: s(30),
          overflow: 'hidden',
        }}
      >
        <MapComponent />

        {/* Temporary button to test Load Status Modal */}
        <TouchableOpacity
          onPress={() => {
            setLoadStatusModalVisible(true);
          }}
          style={{
            position: 'absolute',
            top: vs(25),
            right: s(25),
            backgroundColor: COLORS.primary[500],
            paddingHorizontal: s(18),
            paddingVertical: vs(12),
            borderRadius: s(10),
            zIndex: 10,
            elevation: 5,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: FONT_FAMILIES.bold,
              fontSize: ms(14),
            }}
          >
            View Load Status
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= EXISTING MODALS ================= */}

      <PickupModal
        open={pickupModalVisible}
        onOpen={setPickupModalVisible}
      />

      <DropModal
        open={dropModalVisible}
        onOpen={setDropModalVisible}
      />

      {/* ================= LOAD STATUS MODAL ================= */}

<LoadStatusModal
  visible={loadStatusModalVisible}
  status={loadStatus}
  onClose={handleCloseLoadStatusModal}
  onStatusChange={handleStatusChange}
  loadPostId="LPmobile001"
  receipt={{
    origin: 'Dadar, Mumbai, Maharashtra, India',
    destination: 'Bandra, Mumbai, Maharashtra, India',
    declareweight: 996.28,
    vehicleReportedAt: 996.28,
    LoadingAt: 0,
    Numberofpackages: -0.28,
    totalOrderFare: 996,
    cashPaid: 996,
  }}
/>
    </SafeAreaView>
  );
};

export default DashboardScreen;
