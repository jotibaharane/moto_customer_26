import { FONT_FAMILIES, fp } from '@theme/index';
import React, { memo, useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import CircularLoader from '../CircularLoader';

const OverlayLoader = ({
  visible = false,
  onClose, // ✅ add this
}: any) => {
  if (!visible) return null;
  const [timeLeft, setTimeLeft] = React.useState(150);

  useEffect(() => {
    let timer: any;
    if (visible && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [visible, timeLeft]);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose} // ✅ handle back
    >
      <View style={styles.container}>
        <View style={styles.overlay} />

        <View style={styles.card}>
          <CircularLoader duration={timeLeft} showTimer={true} />
          <Text style={styles.text}>Waiting for Driver’s Confirmation</Text>
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

  text: {
    marginTop: 12,
    color: '#4CAF50',
    fontFamily: FONT_FAMILIES.semiBold,
    fontSize: fp(20),
    textAlign: 'center',
  },
});
