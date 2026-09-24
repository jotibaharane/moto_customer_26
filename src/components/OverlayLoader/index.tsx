import CustomButton from '@components/Button';
import { FONT_FAMILIES, fp } from '@theme/index';
import React, { memo, useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import CircularLoader from '../CircularLoader';

const OverlayLoader = ({
  visible = false,
  onClose,
  onCancel,
  cancelling = false,
  canCancel = true,
}: any) => {
  const [timeLeft, setTimeLeft] = React.useState(150);

  useEffect(() => {
    if (visible) setTimeLeft(150);
  }, [visible]);

  useEffect(() => {
    if (!visible || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [visible, timeLeft]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.overlay} />

        <View style={styles.card}>
          <CircularLoader duration={timeLeft} showTimer={true} />
          <Text style={styles.text}>Waiting for Driver’s Confirmation</Text>
          {onCancel ? (
            <CustomButton
              title={cancelling ? 'Cancelling…' : 'Cancel Load Post'}
              onPress={onCancel}
              disbled={cancelling || !canCancel}
              style={styles.cancelButton}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

export default memo(OverlayLoader);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* 🔥 FAKE BLUR */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d9d9d9d0', // dim background
  },

  /* 🔥 GLASS CARD */
  card: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },

  cancelButton: {
    marginTop: 24,
    alignSelf: 'stretch',
  },

  text: {
    marginTop: 12,
    color: '#4CAF50',
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: fp(20),
    textAlign: 'center',
  },
});
