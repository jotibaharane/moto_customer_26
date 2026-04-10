import { useSetMpinMutation } from '@api/Mutations';
import CustomButton from '@components/Button';
import NumberPad from '@components/NumberPad';
import { OtpInput } from '@components/OtpInput';
import { navigate, reset } from '@navigation/NavigationService';
import { useRoute } from '@react-navigation/native';
import { RootState } from '@store/rootReducer';
import { signIn } from '@store/slices/Auth/authSlice';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './ConfirmMpin.style';

const ConfirmMPINScreen = () => {
  const dispatch = useDispatch();
  const customer = useSelector((state: RootState) => state.auth);
  const route = useRoute<any>();
  const firstPin = route?.params?.pin || '';
  const otpRef = React.useRef<any>(null);
  const [pin, setPin] = useState('');
  const [setMpin, { isLoading }] = useSetMpinMutation();

  const addDigit = (d: string) => {
    if (pin.length < 6) {
      const newPin = pin + d;
      setPin(newPin);
      otpRef.current?.setValue(newPin);
    }
  };

  const remove = () => {
    const newPin = pin.slice(0, -1);
    setPin(newPin);
    otpRef.current?.setValue(newPin);
  };

  const handleSubmit = async () => {
    if (pin !== firstPin) {
      Alert.alert(
        'MPIN does not match',
        'Please enter the correct MPIN to confirm.',
      );
      setPin('');
      return;
    }

    try {
      const resp = await setMpin({
        CustomerID: customer?.CustomerID || '',
        ContactNo: customer?.ContactNo || '',
        Customer_MPIN: pin,
      }).unwrap();

      if (resp?.status_code === '00') {
        dispatch(signIn({ ...customer, MPIN_Flag: 'Y' } as any));
        reset('BottomNavigation');
      } else {
        Alert.alert('Error', resp?.status_desc || 'Failed to set MPIN');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Network error. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <OtpInput
        ref={otpRef}
        numberOfDigits={6}
        theme={{
          pinCodeContainerStyle: styles.pinBox,
          pinCodeTextStyle: styles.pinText,
          filledPinCodeContainerStyle: styles.filledPinBox,
          containerStyle: styles.otpContainer,
        }}
      />

      <View style={styles.numberPadContainer}>
        <NumberPad onPress={addDigit} onDelete={remove} />
      </View>

      <View style={styles.buttonRow}>
        <CustomButton
          title="Skip"
          style={styles.button}
          variant="outline"
          onPress={() => navigate('BottomNavigation')}
        />
        <CustomButton
          title="Submit"
          style={styles.button}
          variant="filled"
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

export default ConfirmMPINScreen;
