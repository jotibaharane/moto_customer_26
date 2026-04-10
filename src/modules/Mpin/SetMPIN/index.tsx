import CustomButton from '@components/Button';
import NumberPad from '@components/NumberPad';
import { OtpInput } from '@components/OtpInput';
import { navigate } from '@navigation/NavigationService';
import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from './SetMpin.style';

const SetMPINScreen = () => {
  const otpRef = React.useRef<any>(null);
  const [pin, setPin] = useState('');

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

  return (
    <View style={styles.container}>
      <OtpInput
        ref={otpRef}
        numberOfDigits={6}
        autoFocus={false}
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
          onPress={() =>
            navigate('ConfirmMPIN', {
              pin,
            })
          }
        />
      </View>
    </View>
  );
};

export default SetMPINScreen;
