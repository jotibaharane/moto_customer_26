import { navigate } from '@navigation/NavigationService';
import { RootState } from '@store/rootReducer';
import { setWeight } from '@store/slices/Booking/bookingSlice';
import { COLORS, FONT_FAMILIES, fp, hp, wp } from '@theme/index';
import React, { memo, useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
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
  const { weight:approximateWeightKg } = useSelector(
    (state: RootState) => state?.booking
  );
  const [weight, setWeightValue] = useState('');
  const dispatch = useDispatch();
  const handleSubmit = () => {
    dispatch(setWeight({ weight: weight }));
    setModalVisible(false);
    navigate('SelectVehicleScreen');
  };

  useEffect(() => {
    setWeightValue(approximateWeightKg?.toString());
  }, []);
  return (
    <Modal animationType="fade" transparent visible={modalVisible}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Approx Weight (KG)</Text>

          <TextInput
            placeholder="Enter weight"
            style={styles.input}
            value={weight}
            onChangeText={setWeightValue}
            placeholderTextColor="#999"
            keyboardType="number-pad"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default memo(WeightModal);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  card: {
    width: '85%',
    backgroundColor: COLORS.white[100],
    borderRadius: 16,
    paddingVertical: hp(20),
    paddingHorizontal: wp(16),
    elevation: 6,
  },

  title: {
    fontSize: fp(20),
    fontFamily: FONT_FAMILIES.semiBold,
    color: COLORS.primary[500],
  },

  input: {
    borderWidth: 1.5,
    paddingHorizontal: wp(12),
    borderRadius: fp(8),
    marginTop: hp(15),
    borderColor: COLORS.gray[200],
    height: hp(42),
    fontFamily: FONT_FAMILIES.regular,
    color: COLORS.black[500],
  },

  button: {
    marginTop: hp(20),
    alignSelf: 'flex-end',
  },

  buttonText: {
    fontSize: fp(16),
    color: COLORS.primary[500],
    fontFamily: FONT_FAMILIES.bold,
  },
});
