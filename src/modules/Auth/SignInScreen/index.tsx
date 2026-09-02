import { useSendOtpMutation, useValidateOtpMutation } from '@api/api';
import { OtpInput } from '@components/OtpInput';
import { reset } from '@navigation/NavigationService';
import { signIn } from '@store/slices/Auth/authSlice';
import { COLORS, vs } from '@theme/index';
import { Colors, FONT_FAMILIES, fs, s } from '@theme/New';
import { OTP_TIME } from '@utils/constants';
import { formatTime } from '@utils/datetime.utils';
import { ChevronDown } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
      await sendOtp({ mobile: mobileNumber }).unwrap();

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
        mobile: mobileNumber,
        otp,
        Role: 'CUSTOMER',
      }).unwrap();
      dispatch(signIn(resp?.data));
      if (resp?.status === '01') {
        reset('SignUp', {
          mobile: mobileNumber,
        });
        return;
      } else {
        Alert.alert(resp?.message);
      }
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

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSendOtp}
        disabled={isTimerRunning || isSendingOtp}
        style={{
          marginTop: vs(35),
          alignSelf: 'center',
          paddingHorizontal: s(15),
          paddingVertical: s(20),
          borderRadius: 8,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 3, // Android
        }}
      >
        {isSendingOtp ? (
          <ActivityIndicator size="small" color={COLORS.primary[500]} />
        ) : (
          <Text
            style={{
              fontFamily: FONT_FAMILIES.medium,
              fontSize: fs(22),
              lineHeight: 20,
              letterSpacing: -0.5,
              color: Colors.primary,
            }}
          >
            Send OTP
          </Text>
        )}
      </TouchableOpacity>
      {isOtpSent && !isSendingOtp && (
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

          <TouchableOpacity
            onPress={handleVerifyOtp}
            disabled={isVerifyingOtp}
            style={{
              marginTop: vs(65),
              alignSelf: 'center',
              backgroundColor: Colors.primary,
              width: '100%',
              paddingVertical: vs(16),
              borderRadius: 8,
            }}
          >
            {isVerifyingOtp ? (
              <ActivityIndicator size="small" color={COLORS.primary[500]} />
            ) : (
              <Text
                style={{
                  fontFamily: FONT_FAMILIES.bold,
                  fontSize: fs(22),
                  lineHeight: 20,
                  letterSpacing: -0.5,
                  color: Colors.white,
                  textAlign: 'center',
                }}
              >
                Verify
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default SignInScreen;
