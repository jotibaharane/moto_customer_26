import { useMpinLoginMutation } from '@api/Mutations';
import CustomButton from '@components/Button';
import { OtpInput } from '@components/OtpInput';
import { reset } from '@navigation/NavigationService';
import { RootState } from '@store/rootReducer';
import React from 'react';
import { Alert, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { styles } from './MpinLogin.style';

const MpinLogin = () => {
  const customer = useSelector((state: RootState) => state.auth);
  const [mpinLogin] = useMpinLoginMutation();
  const [mpin, setMpin] = React.useState('');

  const handleMpinLogin = async () => {
    try {
      const resp = await mpinLogin({
        ContactNo: customer?.ContactNo || '',
        CustomerID: customer?.CustomerID || '',
        Customer_MPIN: mpin,
      }).unwrap();

      if (resp?.status_code === '00') {
        reset('BottomNavigation');
      } else {
        Alert.alert('Login Failed', resp?.message || 'Invalid MPIN');
      }
    } catch (err) {
      console.log('MPIN Login Error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Login With Your MPIN</Text>

      <View style={styles.otpWrapper}>
        <OtpInput
          numberOfDigits={6}
          onTextChange={setMpin}
          theme={{
            pinCodeContainerStyle: styles.pinBox,
            pinCodeTextStyle: styles.pinText,
            filledPinCodeContainerStyle: styles.filledPinBox,
            containerStyle: styles.otpContainer,
          }}
        />

        <Text style={styles.helperText}>Enter the 6-digit MPIN</Text>
      </View>

      <CustomButton
        title="Login"
        style={styles.loginButton}
        variant="filled"
        onPress={handleMpinLogin}
      />
    </View>
  );
};

export default MpinLogin;
