import { useSendOtpMutation, useValidateOtpMutation } from '@api/Mutations';
import CustomButton from '@components/Button';
import { OtpInput } from '@components/OtpInput';
import { navigate } from '@navigation/NavigationService';
import { signIn } from '@store/slices/Auth/authSlice';
import { COLORS } from '@theme/index';
import { OTP_TIME } from '@utils/constants';
import { formatTime } from '@utils/datetime.utils';
import { ChevronDown } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { styles } from './SignIn.style';

const SignInScreen = () => {
  const dispatch = useDispatch();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [validateOtp, { isLoading: isVerifyingOtp }] = useValidateOtpMutation();

  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(OTP_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;

    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startTimer = () => {
    setTimer(OTP_TIME);
    setIsTimerRunning(true);
  };

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert('Enter valid 10 digit number');
      return;
    }

    try {
      await sendOtp({ mobile_number: mobileNumber }).unwrap();

      setIsOtpSent(true);
      startTimer();
    } catch (error) {
      console.log('OTP send error:', error);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      Alert.alert('Enter valid OTP');
      return;
    }

    try {
      const resp = await validateOtp({
        mobile_number: mobileNumber,
        otp,
      }).unwrap();

      if (resp.status !== '00') {
        Alert.alert(resp?.message);
        return;
      }

      if (!resp.Customer_Details) {
        navigate('SignUp', {
          mobile: mobileNumber,
        });
        return;
      }

      dispatch(signIn(resp.Customer_Details));
    } catch (error) {
      console.log('OTP verify error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hi, Welcome To{'\n'}Motohelp</Text>

      <Text style={styles.subtitle}>Enter Mobile number for verification</Text>

      <View style={styles.inputContainer}>
        <View style={styles.countryCodeContainer}>
          <Image
            source={require('@assets/images/Flags.png')}
            style={styles.flag}
          />
          <Text style={styles.countryCodeText}>+91</Text>
          <ChevronDown size={24} color={COLORS.black[500]} />
        </View>

        <TextInput
          value={mobileNumber}
          onChangeText={text => {
            if (isTimerRunning || isOtpSent) {
              setIsOtpSent(false);
              setIsTimerRunning(false);
            }
            setMobileNumber(text);
          }}
          style={styles.input}
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          placeholderTextColor={COLORS.gray[500]}
        />
      </View>
      <CustomButton
        title={'Send OTP'}
        variant="filled"
        style={styles.button}
        onPress={handleSendOtp}
        disbled={isTimerRunning}
        loading={isSendingOtp}
      />
      {isOtpSent && (
        <>
          <Text style={styles.subtitle}>Check your SMS For OTP</Text>

          <View style={styles.otpContainer}>
            <OtpInput
              numberOfDigits={4}
              onTextChange={setOtp}
              theme={{
                pinCodeContainerStyle: styles.filledPinCodeContainerStyle,
                pinCodeTextStyle: styles.pinCodeTextStyle,
                filledPinCodeContainerStyle: styles.filledPinCodeContainerStyle,
              }}
              autoFocus={false}
            />
          </View>

          {isTimerRunning ? (
            <Text style={styles.expiryText}>
              Your OTP will expire in {formatTime(timer)} seconds.
            </Text>
          ) : (
            <Text style={styles.resendText} onPress={handleSendOtp}>
              Resend OTP
            </Text>
          )}
          <CustomButton
            title={'Verify'}
            variant="filled"
            style={styles.button}
            onPress={handleVerifyOtp}
            loading={isVerifyingOtp}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default SignInScreen;
