import { useSetMpinMutation } from '@api/Mutations';
import CustomButton from '@components/Button';
import NumberPad from '@components/NumberPad';
import { OtpInput } from '@components/OtpInput';
import { navigate, reset } from '@navigation/NavigationService';
import { RootState } from '@store/rootReducer';
import { signIn } from '@store/slices/Auth/authSlice';
import { COLORS, FONT_FAMILIES } from '@theme/index';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './SetMpin.style';

const SetMPINScreen = () => {
  const dispatch = useDispatch();

  const customer = useSelector((state: RootState) => state.auth);

  const [setMpin, { isLoading }] = useSetMpinMutation();

  const pinRef = React.useRef<any>(null);
  const confirmPinRef = React.useRef<any>(null);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      Alert.alert('Error', 'Please enter 6 digit MPIN');
      return;
    }

    if (confirmPin.length !== 6) {
      Alert.alert('Error', 'Please confirm your MPIN');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert(
        'MPIN does not match',
        'Please enter the same MPIN in both fields',
      );

      setConfirmPin('');
      confirmPinRef.current?.setValue('');
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
      <Text
        style={{
          marginTop: 57,
          textAlign: 'center',
          fontSize: 24,
          fontFamily: FONT_FAMILIES.bold,
        }}
      >
        Set New MPIN
      </Text>

      <Text
        style={{
          marginTop: 33,
          fontSize: 12,
          fontFamily: FONT_FAMILIES.regular,
          color: COLORS.gray[500],
          marginBottom: 16,
        }}
      >
        Enter your 6-digit security PIN
      </Text>

      <OtpInput
        ref={pinRef}
        numberOfDigits={6}
        onTextChange={val => setPin(val)}
        theme={{
          pinCodeContainerStyle: styles.filledPinCodeContainerStyle,
          pinCodeTextStyle: styles.pinCodeTextStyle,
          filledPinCodeContainerStyle: styles.filledPinCodeContainerStyle,
        }}
      />

      <Text
        style={{
          marginTop: 33,
          fontSize: 12,
          fontFamily: FONT_FAMILIES.regular,
          color: COLORS.gray[500],
          marginBottom: 16,
        }}
      >
        Confirm your 6-digit security PIN
      </Text>

      <OtpInput
        ref={confirmPinRef}
        numberOfDigits={6}
        onTextChange={val => setConfirmPin(val)}
        theme={{
          pinCodeContainerStyle: styles.filledPinCodeContainerStyle,
          pinCodeTextStyle: styles.pinCodeTextStyle,
          filledPinCodeContainerStyle: styles.filledPinCodeContainerStyle,
        }}
      />

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
          loading={isLoading}
        />
      </View>
    </View>
  );
};

export default SetMPINScreen;
