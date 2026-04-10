import { navigate } from '@navigation/NavigationService';
import { RootState } from '@store/rootReducer';
import { setWeight } from '@store/slices/Booking/bookingSlice';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface WeightModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}
const WeightModal: React.FC<WeightModalProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const { approximateWeightKg } = useSelector(
    (state: RootState) => state?.booking?.booking?.vehicle,
  );
  const [weight, setWeightValue] = useState('');
  const dispatch = useDispatch();
  const handleSubmit = () => {
    dispatch(setWeight({ approximateWeightKg: weight }));
    setModalVisible(false);
    navigate('SelectVehicleScreen');
  };

  useEffect(() => {
    setWeightValue(approximateWeightKg);
  }, []);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        <View
          style={{
            margin: wp(16),
            backgroundColor: COLORS.white[100],
            borderRadius: 16,
            shadowColor: '#000',
            elevation: 5,
            paddingVertical: hp(20),
            paddingHorizontal: wp(14),
          }}
        >
          <Text
            style={{
              fontSize: fp(20),
              fontFamily: FONT_FAMILIES.semiBold,
              color: COLORS.primary[500],
            }}
          >
            Approx Weight
          </Text>
          <TextInput
            placeholder="Approx Weight"
            style={{
              borderWidth: 2,
              paddingHorizontal: wp(25),
              borderRadius: fp(8),
              marginTop: hp(15),
              borderColor: COLORS.gray[75],
              height: hp(38),
            }}
            value={weight}
            onChangeText={setWeightValue}
            placeholderTextColor={COLORS.gray[500]}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={{ marginTop: hp(20), alignSelf: 'flex-end' }}
            onPress={handleSubmit}
          >
            <Text
              style={{
                fontSize: fp(16),
                color: COLORS.primary[500],
                fontFamily: FONT_FAMILIES.bold,
              }}
            >
              Next →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WeightModal;
