import { useSetMpinMutation } from '@api/Mutations';
import CustomButton from '@components/Button';
import { OtpInput } from '@components/OtpInput';
import { navigate, reset } from '@navigation/NavigationService';
import { RootState } from '@store/rootReducer';
import { signIn } from '@store/slices/Auth/authSlice';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        mpin: pin,
      }).unwrap();

       if (resp?.Status === '00') {
        reset('BottomNavigation', { Screen: 'home' });
        dispatch(signIn({ ...customer, isMPINSet: true }));
      } else {
        Alert.alert('Error', resp?.status_desc || 'Failed to set MPIN');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Network error. Try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Set New MPIN</Text>

      <Text style={styles.fieldLabel}>Enter your 6-digit security PIN</Text>

      <OtpInput
        ref={pinRef}
        numberOfDigits={6}
        onTextChange={val => setPin(val)}
        theme={{
          pinCodeContainerStyle: styles.filledPinCodeContainerStyle,
          pinCodeTextStyle: styles.pinCodeTextStyle,
          filledPinCodeContainerStyle: styles.filledPinCodeContainerStyle,
        }}
        autoFocus={false}
      />

      <Text style={styles.fieldLabel}>Confirm your 6-digit security PIN</Text>

      <OtpInput
        ref={confirmPinRef}
        numberOfDigits={6}
        onTextChange={val => setConfirmPin(val)}
        theme={{
          pinCodeContainerStyle: styles.filledPinCodeContainerStyle,
          pinCodeTextStyle: styles.pinCodeTextStyle,
          filledPinCodeContainerStyle: styles.filledPinCodeContainerStyle,
        }}
        autoFocus={false}
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
    </SafeAreaView>
  );
};

export default SetMPINScreen;
