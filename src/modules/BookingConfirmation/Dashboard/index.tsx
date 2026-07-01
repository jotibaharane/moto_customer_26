import SearchField from '@components/SearchField';
import React, { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootState } from '@store/rootReducer';
import { useDispatch, useSelector } from 'react-redux';

import { navigate } from '@navigation/NavigationService';
import { setWeight } from '@store/slices/Booking/bookingSlice';
import { COLORS, FONT_FAMILIES, ms } from '@theme/index';
import { ArrowRight } from 'lucide-react-native';
import { styles } from './Dashboard.style';
import DropModal from './components/DropModal';
import MapComponent from './components/MapComponent';
import PickupModal from './components/PickupModal';

const DashboardScreen = () => {
  const { pickup ,delivery,weight} = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();
  const [pickupModalVisible, setPickupModalVisible] = useState(false);
  const [dropModalVisible, setDropModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* ================= TOP ================= */}

      <View style={styles.topWrapper}>
        <View style={styles.card}>
          <View style={styles.row}>
            <SearchField
              placeholder="Pick up Address"
              onPress={() => setPickupModalVisible(true)}
              iconColor="#4CAF50"
              editable={false}
              value={pickup?.fullAddress}
              iconType="location"
            />
            {/* <Bell size={30} /> */}
          </View>

          <View style={styles.row}>
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
            {/* <View style={styles.emptyBox} /> */}
          </View>
          <View style={styles.declare_weight_container}>
            <Text style={styles.declare_weight}>Declare Weight</Text>
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
          </View>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignSelf: 'flex-end' }}
            onPress={() => {
              navigate('SelectVehicleScreen');
              // if (
              //   pickup &&
              //   delivery &&
              //   weight
              // ) {
              //   navigate('SelectVehicleScreen');
              // } else {
              //   Alert.alert('Pickup,Drop and weight required');
              // }
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
        </View>
      </View>

      {/* ================= MAP ================= */}
     <MapComponent />

      {/* ================= MODALS ================= */}
      <PickupModal open={pickupModalVisible} onOpen={setPickupModalVisible} />
      <DropModal open={dropModalVisible} onOpen={setDropModalVisible} />
    </SafeAreaView>
  );
};

export default DashboardScreen;
