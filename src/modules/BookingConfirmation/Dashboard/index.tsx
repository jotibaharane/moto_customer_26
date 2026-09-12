import SearchField from '@components/SearchField';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootState } from '@store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';

import { navigate } from '@navigation/NavigationService';
import { setWeight, setvalue } from '@store/slices/Booking/bookingSlice';
import { COLORS, FONT_FAMILIES, ms, s, vs } from '@theme/index';
import { ArrowRight } from 'lucide-react-native';
import { styles } from './Dashboard.style';
import DropModal from './components/DropModal';
import MapComponent from './components/MapComponent';
import PickupModal from './components/PickupModal';
import { useNavigation } from '@react-navigation/native';
import CustomRadioButton from '@components/CustomCheckbox/CustomRadioButton';
import LoadStatusModal from './components/LoadStatusModal';
type LoadStatus =
  | 'REPORTED'
  | 'LOADING'
  | 'LOADED'
  | 'PAYMENT'
  | 'COMPLETED';
const DashboardScreen = () => {
  const navigation = useNavigation()
  const { pickup, delivery, weight, value } = useSelector(
    (state: RootState) => state.booking,
  );
  const dispatch = useDispatch();
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [dropModalVisible, setDropModalVisible] = useState(false);
  const [declarevalue, setdeclarevalue] = useState(false)
  const [showStatusModal, setShowStatusModal] =
  useState(false);
const [selectedStatus, setSelectedStatus] =
  useState<LoadStatus>('REPORTED');
  const handleStatusChange = (newStatus: LoadStatus) => {
  console.log('NEW STATUS:', newStatus);
  setSelectedStatus(newStatus);
};

  console.log({ pickupModalVisible, dropModalVisible });

  const handledeclare = () => {
    setdeclarevalue(true)
  }

  const handlecheck = () => {
    setShowStatusModal(true)
    // navigation.navigate('CalledRideScreen' as never)
  }
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
              {/* <Bell size={30} /> */}
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
                {/* <View style={styles.emptyBox} /> */}
              </View>
            )}
            {pickup?.fullAddress && delivery?.fullAddress && (
              <>
                <View style={styles.declare_weight_container}>
                  <Text style={styles.declare_weight}>Declare Weight</Text>
                  <TextInput
                    placeholder="eg. 1000"
                    placeholderTextColor={COLORS.gray[500]}
                    style={styles.weight_input}
                    value={weight?.toString() ?? ''}
                    keyboardType="number-pad"
                    onChangeText={text => dispatch(setWeight({ weight: text }))}
                  />

                  <Text style={styles.kg}>Kg</Text>
                </View>
                <View style={styles.declare_weight_container}>
                  <Text style={styles.declare_weight}>Declare Value</Text>

                  <CustomRadioButton
                    selected={declarevalue}
                    onPress={handledeclare}
                    size={20}
                    label='Yes'
                    activeColor={COLORS.primary[500]}
                    inactiveColor={COLORS.gray[400]}
                  />

                  <TextInput
                    placeholder="eg. 1000"
                    placeholderTextColor={COLORS.gray[500]}
                    style={[
                      styles.weight_input,
                      !declarevalue && { backgroundColor: '#F3F4F6' },
                    ]}
                    value={value?.toString() ?? ''}
                    keyboardType="number-pad"
                    editable={declarevalue}
                    onChangeText={text => dispatch(setvalue({ value: text }))}
                  />

                  <Text style={styles.kg}>₹</Text>
                </View>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignSelf: 'flex-end' }}
                  onPress={() => {
                    navigate('SelectVehicleScreen');
                  }}
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
                  <ArrowRight size={30} color={COLORS.primary[500]} />
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
        <TouchableOpacity
          onPress={handlecheck}
          style={{
            position: 'absolute',
            bottom: 30,
            right: 30,
            backgroundColor: COLORS.primary[500],
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: FONT_FAMILIES.bold,
            }}>
            Check
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= MODALS ================= */}
      <PickupModal open={pickupModalVisible} onOpen={setPickupModalVisible} />
      <DropModal open={dropModalVisible} onOpen={setDropModalVisible} />


<LoadStatusModal
  visible={showStatusModal}
  status={selectedStatus}
  // onStatusChange={setSelectedStatus}
  onStatusChange={handleStatusChange}
 onClose={() => {
    setShowStatusModal(false);
    setSelectedStatus('REPORTED');
  }}
  loadPostId="123456"
  reportedTime="2:00 pm"
  loadingTime="00:20"
  packagesLoaded={1000}
  loadingDuration="30 min : 00:20"
  receipt={{
    receiptNo: 'REC-10001',
    loadPostId: '123456',
    vehicleNo: 'MH 12 AB 1234',
    customerName: 'ABC Transport',
    driverName: 'Rahul Kumar',
    freightAmount: 25000,
    advanceAmount: 10000,
    balanceAmount: 15000,
    paymentMode: 'UPI',
    paymentStatus: 'PAID',
    paymentDate: '11 Sep 2026',
  }}
/>

    </SafeAreaView>
  );
};

export default DashboardScreen;
